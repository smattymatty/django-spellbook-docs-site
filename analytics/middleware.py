# analytics/middleware.py
import logging
from typing import Callable, List, Optional, Set, Union
from ipaddress import IPv4Address, IPv6Address

from django.http import HttpRequest, HttpResponse
from django.utils import timezone
from django.conf import settings
from datetime import date
from django.db.models import F # Import F expression

from .models import PageView, DailyPageViewCount, UniqueVisitor

# Configure logger
logger = logging.getLogger('analytics.middleware')

class PageViewMiddleware:
    """
    Middleware that tracks page views, unique visitors, and daily view counts.

    This middleware captures analytics data for non-excluded paths and stores it
    in the database. It handles tracking page views, updating daily counts,
    and managing unique visitor records.

    Attributes:
        get_response (Callable): The next middleware or view in the chain.
        excluded_paths (Set[str]): Paths that should not be tracked.
        excluded_prefixes (List[str]): Path prefixes that should not be tracked.
        track_authenticated_users (bool): Whether to track authenticated users.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        """
        Initialize the PageViewMiddleware.

        Args:
            get_response: The next middleware or view in the processing chain.
        """
        self.get_response = get_response

        # Default paths to exclude from tracking
        self.excluded_paths: Set[str] = {
            '/favicon.ico',
            '/sw.js',
            '/robots.txt',
            '/sitemap.xml',
        }

        # Add custom excluded paths from settings if defined
        if hasattr(settings, 'ANALYTICS_EXCLUDED_PATHS'):
            self.excluded_paths.update(settings.ANALYTICS_EXCLUDED_PATHS)

        # Path prefixes to exclude (always skip these)
        self.excluded_prefixes: List[str] = [
            '/admin/',
            '/a-panel/', # Assuming this is another admin-like panel
            '/static/',
            '/media/',
            '/analytics/', # Corrected path separator
            '/wp-admin/',
            '/wp-includes/',
            '/wp-content/',
            '/wordpress/',

        ]

        # Add custom excluded prefixes from settings if defined
        if hasattr(settings, 'ANALYTICS_EXCLUDED_PREFIXES'):
            self.excluded_prefixes.extend(settings.ANALYTICS_EXCLUDED_PREFIXES)

        # Whether to track authenticated users
        self.track_authenticated_users: bool = getattr(
            settings, 'ANALYTICS_TRACK_AUTHENTICATED_USERS', True
        )
        
        self.validate_url: bool = getattr(
            settings, 'ANALYTICS_VALIDATE_URL', True
        )

        logger.debug(f"PageViewMiddleware initialized with {len(self.excluded_paths)} excluded paths and {len(self.excluded_prefixes)} excluded prefixes") # Improved logging

    def __call__(self, request: HttpRequest) -> HttpResponse:
        """
        Process the request and track analytics data if applicable.

        Args:
            request: The incoming HTTP request.

        Returns:
            HttpResponse: The response from the next middleware or view.
        """
        # Get response first - analytics should not delay page loading
        response = self.get_response(request)

        try:
            # Check if we should track this request
            if not self._should_track_request(request):
                # Log why tracking was skipped (optional, but helpful for debugging)
                # logger.debug(f"Skipping analytics tracking for path: {request.path}")
                return response

            # Get visitor info
            ip_address = self._get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')

            # --- Perform DB operations only if tracking is enabled ---
            # Record the page view
            self._record_page_view(request.path, ip_address, user_agent)

            # Update daily count
            self._update_daily_count(request.path)

            # Track unique visitors
            self._track_unique_visitor(ip_address, user_agent)

        except Exception as e:
            # Log the error but don't affect the user experience
            logger.error(f"Error tracking analytics for path {request.path}: {str(e)}", exc_info=True) # Added path to error log

        return response

    def _should_track_request(self, request: HttpRequest) -> bool:
        """
        Determine if the current request should be tracked based on various criteria.

        Args:
            request: The HTTP request to evaluate.

        Returns:
            bool: True if the request should be tracked, False otherwise.
        """
        path = request.path

        # 1. Skip if path is explicitly excluded
        if path in self.excluded_paths:
            # logger.debug(f"Path '{path}' is in excluded_paths.") # Debug log
            return False

        # 2. Skip if path starts with any excluded prefix
        if any(path.startswith(prefix) for prefix in self.excluded_prefixes):
            # logger.debug(f"Path '{path}' starts with an excluded prefix.") # Debug log
            return False

        # 3. Skip if user is authenticated and we're not tracking authenticated users
        if request.user.is_authenticated and not self.track_authenticated_users:
            # logger.debug(f"Authenticated user tracking disabled for user {request.user}.") # Debug log
            return False

        # 4. Check for AJAX requests if configured to ignore them
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        if is_ajax and getattr(settings, 'ANALYTICS_IGNORE_AJAX', True):
            # logger.debug(f"AJAX request ignored for path '{path}'.") # Debug log
            return False

        if self.validate_url:
            from .utils import validate_url
            path_to_validate = request.get_full_path() # Includes query string
            if not validate_url(path_to_validate):
                logger.debug(f"Path '{path_to_validate}' failed validate_url check.")
                return False

        # If none of the above conditions are met, track the request
        return True

    def _get_client_ip(self, request: HttpRequest) -> str:
        """
        Extract the client IP address from the request, handling proxies.

        Args:
            request: The HTTP request.

        Returns:
            str: The client's potentially anonymized IP address or a placeholder.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # Get the first IP in the chain (client IP)
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')

        # Sanitize and validate IP address
        return self._sanitize_ip(ip)

    def _sanitize_ip(self, ip: str) -> str:
        """
        Sanitize, validate, and potentially anonymize an IP address.

        Args:
            ip: The IP address string.

        Returns:
            str: The processed IP address or "0.0.0.0" if invalid.
        """
        try:
            # Check if it's a valid IPv4 or IPv6 address
            if ':' in ip:
                # Validate IPv6
                IPv6Address(ip)
                # Anonymize if configured
                if getattr(settings, 'ANALYTICS_ANONYMIZE_IP', False):
                    # Keep first 4 segments (64 bits)
                    parts = ip.split(':')
                    return ':'.join(parts[:4]) + '::' # Simplified anonymization
            else:
                # Validate IPv4
                IPv4Address(ip)
                # Anonymize if configured
                if getattr(settings, 'ANALYTICS_ANONYMIZE_IP', False):
                    # Keep first 3 octets, zero out the last
                    parts = ip.split('.')
                    return '.'.join(parts[:3]) + '.0'
            # Return original valid IP if not anonymizing
            return ip
        except (ValueError, TypeError): # Catch TypeError for None or unexpected types
            logger.warning(f"Invalid or unexpected IP address format: {ip}")
            return "0.0.0.0"  # Default fallback for invalid IPs

    def _record_page_view(self, url: str, ip_address: str, user_agent: str) -> None:
        """
        Record a page view in the database. Assumes URL validation happened earlier.

        Args:
            url: The URL path that was viewed.
            ip_address: The visitor's IP address.
            user_agent: The visitor's user agent string.
        """
        try:
            # --- REMOVED REDUNDANT CHECKS ---
            # No need to check excluded_prefixes or excluded_paths here,
            # as _should_track_request already handled it.

            PageView.objects.create(
                url=url,
                ip_address=ip_address,
                user_agent=user_agent
            )
            logger.debug(f"Recorded page view for URL: {url}") # Optional debug log
        except Exception as e:
            logger.error(f"Failed to record page view for {url}: {str(e)}")


    def _update_daily_count(self, url: str) -> None:
        """
        Update the daily page view count for a URL. Assumes URL validation happened earlier.

        Args:
            url: The URL path to update counts for.
        """
        today = date.today()
        try:
            # --- REMOVED REDUNDANT CHECKS ---
            # No need to check excluded_prefixes or excluded_paths here.

            daily_count, created = DailyPageViewCount.objects.get_or_create(
                url=url,
                date=today,
                defaults={'count': 1}
            )

            if not created:
                # Use F() expression for atomic update to avoid race conditions
                DailyPageViewCount.objects.filter(
                    url=url, date=today
                ).update(count=F('count') + 1)
            # logger.debug(f"Updated daily count for URL: {url}, Date: {today}") # Optional debug log
        except Exception as e:
            logger.error(f"Failed to update daily count for {url}: {str(e)}")
            # Re-raise might be too disruptive; consider just logging
            # raise

    def _track_unique_visitor(self, ip_address: str, user_agent: str) -> None:
        """
        Track a unique visitor or update their visit count and last visit timestamp.

        Args:
            ip_address: The visitor's IP address.
            user_agent: The visitor's user agent string.
        """
        now = timezone.now() # Get current time once
        try:
            visitor, created = UniqueVisitor.objects.get_or_create(
                ip_address=ip_address,
                user_agent=user_agent, # Consider normalizing user agents if needed
                defaults={
                    'first_visit': now,
                    'last_visit': now,
                    'visit_count': 1 # Start count at 1 for new visitors
                }
            )

            if not created:
                # Update the existing visitor record efficiently
                UniqueVisitor.objects.filter(pk=visitor.pk).update(
                    last_visit=now,
                    visit_count=F('visit_count') + 1
                )
                # logger.debug(f"Updated unique visitor: {ip_address}") # Optional debug log
            # else:
                # logger.debug(f"Created new unique visitor: {ip_address}") # Optional debug log
        except Exception as e:
            logger.error(f"Failed to track unique visitor {ip_address}: {str(e)}")
