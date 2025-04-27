# analytics/middleware.py
import logging
from typing import Callable, List, Optional, Set, Union
from ipaddress import IPv4Address, IPv6Address

from django.http import HttpRequest, HttpResponse
from django.utils import timezone
from django.conf import settings
from datetime import date

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
            '/wp-admin/setup-config.php'
        }
        
        # Add custom excluded paths from settings if defined
        if hasattr(settings, 'ANALYTICS_EXCLUDED_PATHS'):
            self.excluded_paths.update(settings.ANALYTICS_EXCLUDED_PATHS)
        
        # Path prefixes to exclude (always skip these)
        self.excluded_prefixes: List[str] = [
            '/admin/', 
            '/static/', 
            '/media/',
            '/analytics/'
        ]
        
        # Add custom excluded prefixes from settings if defined
        if hasattr(settings, 'ANALYTICS_EXCLUDED_PREFIXES'):
            self.excluded_prefixes.extend(settings.ANALYTICS_EXCLUDED_PREFIXES)
        
        # Whether to track authenticated users
        self.track_authenticated_users: bool = getattr(
            settings, 'ANALYTICS_TRACK_AUTHENTICATED_USERS', False
        )
        
        logger.debug(f"PageViewMiddleware initialized with {len(self.excluded_paths)} excluded paths")

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
                return response
            
            # Get visitor info
            ip_address = self._get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Record the page view
            self._record_page_view(request.path, ip_address, user_agent)
            
            # Update daily count
            self._update_daily_count(request.path)
            
            # Track unique visitors
            self._track_unique_visitor(ip_address, user_agent)
            
        except Exception as e:
            # Log the error but don't affect the user experience
            logger.error(f"Error tracking analytics: {str(e)}", exc_info=True)
        
        return response
    
    def _should_track_request(self, request: HttpRequest) -> bool:
        """
        Determine if the current request should be tracked.
        
        Args:
            request: The HTTP request to evaluate.
            
        Returns:
            bool: True if the request should be tracked, False otherwise.
        """
        # Skip if path is explicitly excluded
        if request.path in self.excluded_paths:
            return False
        
        # Skip if path starts with any excluded prefix
        if any(request.path.startswith(prefix) for prefix in self.excluded_prefixes):
            return False
        
        # Skip if user is authenticated and we're not tracking authenticated users
        if request.user.is_authenticated and not self.track_authenticated_users:
            return False
        
        # Check for AJAX requests if configured to ignore them
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        if is_ajax and getattr(settings, 'ANALYTICS_IGNORE_AJAX', True):
            return False
        
        return True
    
    def _get_client_ip(self, request: HttpRequest) -> str:
        """
        Extract the client IP address from the request.
        
        Handles proxied requests by checking X-Forwarded-For header.
        
        Args:
            request: The HTTP request.
            
        Returns:
            str: The client's IP address.
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
        Sanitize and validate an IP address.
        
        Args:
            ip: The IP address to sanitize.
            
        Returns:
            str: The sanitized IP address or a placeholder if invalid.
        """
        try:
            # Attempt to validate as IPv4 or IPv6
            IPv4Address(ip) or IPv6Address(ip)
            
            # Anonymize IP if configured
            if getattr(settings, 'ANALYTICS_ANONYMIZE_IP', False):
                if ':' in ip:  # IPv6
                    # Keep first 4 segments of IPv6
                    return ':'.join(ip.split(':')[:4]) + ':0:0:0:0'
                else:  # IPv4
                    # Keep first 3 octets of IPv4, zero out the last
                    return '.'.join(ip.split('.')[:3]) + '.0'
            return ip
        except ValueError:
            logger.warning(f"Invalid IP address: {ip}")
            return "0.0.0.0"  # Default fallback
    
    def _record_page_view(self, url: str, ip_address: str, user_agent: str) -> None:
        """
        Record a page view in the database.
        
        Args:
            url: The URL path that was viewed.
            ip_address: The visitor's IP address.
            user_agent: The visitor's user agent string.
        """
        try:
            PageView.objects.create(
                url=url,
                ip_address=ip_address,
                user_agent=user_agent
            )
        except Exception as e:
            logger.error(f"Failed to record page view: {str(e)}")
            raise  # Re-raise for the parent exception handler
    
    def _update_daily_count(self, url: str) -> None:
        """
        Update the daily page view count for a URL.
        
        Args:
            url: The URL path to update counts for.
        """
        today = date.today()
        try:
            daily_count, created = DailyPageViewCount.objects.get_or_create(
                url=url,
                date=today,
                defaults={'count': 1}
            )
            
            if not created:
                # Use F() to avoid race conditions
                from django.db.models import F
                DailyPageViewCount.objects.filter(
                    url=url, date=today
                ).update(count=F('count') + 1)
        except Exception as e:
            logger.error(f"Failed to update daily count: {str(e)}")
            raise  # Re-raise for the parent exception handler
    
    def _track_unique_visitor(self, ip_address: str, user_agent: str) -> None:
        """
        Track a unique visitor or update their visit count and timestamp.
        
        Args:
            ip_address: The visitor's IP address.
            user_agent: The visitor's user agent string.
        """
        try:
            visitor, created = UniqueVisitor.objects.get_or_create(
                ip_address=ip_address,
                user_agent=user_agent,
                defaults={
                    'first_visit': timezone.now(),
                    'last_visit': timezone.now()
                }
            )
            
            if not created:
                # Update the existing visitor record
                visitor.last_visit = timezone.now()
                visitor.visit_count += 1
                visitor.save(update_fields=['last_visit', 'visit_count'])
        except Exception as e:
            logger.error(f"Failed to track unique visitor: {str(e)}")
            raise  # Re-raise for the parent exception handler