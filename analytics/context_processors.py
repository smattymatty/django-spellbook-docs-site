# analytics/context_processors.py

import logging
from datetime import date, timedelta
from typing import List, Dict, Any, Optional

from django.conf import settings
from django.core.cache import cache
from django.db.models import Sum, F # Import F if needed elsewhere, Sum is used
from django.http import HttpRequest

from .models import PageView, DailyPageViewCount, UniqueVisitor

# Get logger instance
logger = logging.getLogger(__name__) # Use __name__ for module-level logger

# --- Configuration loading from settings ---

# Prefixes where analytics display is skipped entirely
EXCLUDED_PREFIXES: List[str] = getattr(settings, 'ANALYTICS_EXCLUDED_PREFIXES', [])

# Paths to exclude from aggregate calculations (total views, popular pages)
AGGREGATE_EXCLUDED_PATHS: List[str] = getattr(settings, 'ANALYTICS_AGGREGATE_EXCLUDED_PATHS', [])

# Cache timeout duration
CACHE_TIMEOUT: int = getattr(settings, 'ANALYTICS_CACHE_TIMEOUT', 60 * 5) # Default 5 mins

# --- Helper Functions ---

def _should_display_analytics(path: str) -> bool:
    """
    Checks if analytics should be displayed for the given path based on prefixes.
    """
    if any(path.startswith(prefix) for prefix in EXCLUDED_PREFIXES):
        # logger.debug(f"Analytics display skipped for path '{path}' due to excluded prefix.")
        return False
    return True

def _get_or_cache_total_views() -> int:
    """
    Retrieves total site views from cache or calculates and caches it.
    Excludes paths defined in AGGREGATE_EXCLUDED_PATHS.
    """
    cache_key = "analytics_total_site_views"
    total_views = cache.get(cache_key)
    if total_views is None:
        try:
            # Use aggregate for efficiency if PageView table is large
            # result = PageView.objects.exclude(url__in=AGGREGATE_EXCLUDED_PATHS).aggregate(total=Count('id'))
            # total_views = result.get('total', 0)
            # Or use count() if the table is reasonably sized
            total_views = PageView.objects.exclude(url__in=AGGREGATE_EXCLUDED_PATHS).count()
            cache.set(cache_key, total_views, CACHE_TIMEOUT)
            # logger.debug(f"Calculated and cached total views: {total_views}")
        except Exception as e:
            logger.error(f"Failed to calculate total views: {e}", exc_info=True)
            total_views = 0 # Default to 0 on error
    return total_views

def _get_or_cache_unique_visitors() -> int:
    """
    Retrieves unique visitor count from cache or calculates and caches it.
    """
    cache_key = "analytics_unique_visitors"
    unique_visitors = cache.get(cache_key)
    if unique_visitors is None:
        try:
            unique_visitors = UniqueVisitor.objects.count()
            cache.set(cache_key, unique_visitors, CACHE_TIMEOUT)
            # logger.debug(f"Calculated and cached unique visitors: {unique_visitors}")
        except Exception as e:
            logger.error(f"Failed to calculate unique visitors: {e}", exc_info=True)
            unique_visitors = 0 # Default to 0 on error
    return unique_visitors

def _get_or_cache_popular_pages() -> List[Dict[str, Any]]:
    """
    Retrieves top 5 popular pages (last 7 days) from cache or calculates/caches them.
    Excludes paths defined in AGGREGATE_EXCLUDED_PATHS.
    """
    cache_key = "analytics_popular_pages"
    popular_pages = cache.get(cache_key)
    if popular_pages is None:
        try:
            today = date.today()
            start_date = today - timedelta(days=7)
            
            popular_pages_query = DailyPageViewCount.objects.filter(
                date__gte=start_date
            ).exclude(
                url__in=AGGREGATE_EXCLUDED_PATHS
            ).values('url').annotate(
                total_views=Sum('count')
            ).order_by('-total_views')[:5] # Get top 5

            popular_pages = list(popular_pages_query) # Execute the query
            cache.set(cache_key, popular_pages, CACHE_TIMEOUT)
            # logger.debug(f"Calculated and cached popular pages: {len(popular_pages)} items")
        except Exception as e:
            logger.error(f"Failed to calculate popular pages: {e}", exc_info=True)
            popular_pages = [] # Default to empty list on error
    return popular_pages

def _get_page_specific_analytics(path: str) -> Dict[str, Any]:
    """
    Fetches analytics data specific to the current page path.
    """
    page_data = {
        'page_views_count': 0,
        'today_page_views': 0,
    }
    try:
        # Current page view count (all time)
        page_data['page_views_count'] = PageView.objects.filter(url=path).count()

        # Current page view count (today)
        today = date.today()
        daily_count = DailyPageViewCount.objects.filter(url=path, date=today).first()
        page_data['today_page_views'] = daily_count.count if daily_count else 0

    except Exception as e:
        logger.error(f"Failed to get page-specific analytics for {path}: {e}", exc_info=True)
        # Keep default values (0) on error

    return page_data


# --- Main Context Processor ---

def analytics_context(request: HttpRequest) -> Dict[str, Any]:
    """
    Adds analytics data to the template context, using caching and centralized settings.
    """
    path = request.path

    # 1. Check if analytics should be displayed on this path at all
    if not _should_display_analytics(path):
        return {} # Return empty context if display is skipped

    # 2. Prepare cache key for page-specific + global data bundle
    cache_key = f"analytics_context_data_{path}"
    context = cache.get(cache_key)

    if context is None:
        # logger.debug(f"Cache miss for analytics context: {cache_key}")
        # 3. Get page-specific data
        page_data = _get_page_specific_analytics(path)

        # 4. Get site-wide data (uses its own caching internally)
        total_views = _get_or_cache_total_views()
        unique_visitors = _get_or_cache_unique_visitors()
        popular_pages = _get_or_cache_popular_pages()

        # 5. Combine data into context dictionary
        context = {
            **page_data, # Includes 'page_views_count' and 'today_page_views'
            'total_views': total_views,
            'unique_visitors': unique_visitors,
            'popular_pages': popular_pages,
        }

        # 6. Cache the combined context for this page
        cache.set(cache_key, context, CACHE_TIMEOUT)
        # logger.debug(f"Cached analytics context for path '{path}'")
    # else:
        # logger.debug(f"Cache hit for analytics context: {cache_key}")

    return context