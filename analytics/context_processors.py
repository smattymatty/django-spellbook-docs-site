# analytics/context_processors.py

import logging
from datetime import date, timedelta
from typing import List, Dict, Any, Optional

from django.conf import settings
from django.core.cache import cache
from django.db.models import Sum, Count # Added Count for total views option
from django.http import HttpRequest

from .models import PageView, DailyPageViewCount, UniqueVisitor

# Get logger instance
logger = logging.getLogger(__name__)


def _should_display_analytics(path: str) -> bool:
    """
    Checks if analytics should be displayed for the given path based on prefixes.
    Reads settings dynamically.
    """
    # Get setting inside the function
    excluded_prefixes: List[str] = getattr(settings, 'ANALYTICS_EXCLUDED_PREFIXES', [])
    if any(path.startswith(prefix) for prefix in excluded_prefixes):
        return False
    return True

def _get_or_cache_total_views() -> int:
    """
    Retrieves total site views from cache or calculates and caches it.
    Excludes paths defined in AGGREGATE_EXCLUDED_PATHS.
    Reads settings dynamically.
    """
    cache_key = "analytics_total_site_views"
    total_views = cache.get(cache_key)
    if total_views is None:
        try:
            # Get settings inside the function
            aggregate_excluded_paths: List[str] = getattr(settings, 'ANALYTICS_AGGREGATE_EXCLUDED_PATHS', [])
            cache_timeout: int = getattr(settings, 'ANALYTICS_CACHE_TIMEOUT', 60 * 5)

            # Use count() - generally efficient enough unless table is truly massive
            total_views = PageView.objects.exclude(url__in=aggregate_excluded_paths).count()
            # --- OR use aggregate if you prefer ---
            # result = PageView.objects.exclude(url__in=aggregate_excluded_paths).aggregate(total=Count('id'))
            # total_views = result.get('total', 0)

            cache.set(cache_key, total_views, cache_timeout)
        except Exception as e:
            logger.error(f"Failed to calculate total views: {e}", exc_info=True)
            total_views = 0
    return total_views

def _get_or_cache_unique_visitors() -> int:
    """
    Retrieves unique visitor count from cache or calculates and caches it.
    Reads settings dynamically.
    """
    cache_key = "analytics_unique_visitors"
    unique_visitors = cache.get(cache_key)
    if unique_visitors is None:
        try:
            # Get setting inside the function
            cache_timeout: int = getattr(settings, 'ANALYTICS_CACHE_TIMEOUT', 60 * 5)

            unique_visitors = UniqueVisitor.objects.filter(is_bot=False).count()
            cache.set(cache_key, unique_visitors, cache_timeout)
        except Exception as e:
            logger.error(f"Failed to calculate unique visitors: {e}", exc_info=True)
            unique_visitors = 0
    return unique_visitors

def _get_or_cache_popular_pages() -> List[Dict[str, Any]]:
    """
    Retrieves top 5 popular pages (last 7 days) from cache or calculates/caches them.
    Excludes paths defined in AGGREGATE_EXCLUDED_PATHS.
    Reads settings dynamically.
    """
    cache_key = "analytics_popular_pages"
    popular_pages = cache.get(cache_key)
    if popular_pages is None:
        try:
            # Get settings inside the function
            aggregate_excluded_paths: List[str] = getattr(settings, 'ANALYTICS_AGGREGATE_EXCLUDED_PATHS', [])
            cache_timeout: int = getattr(settings, 'ANALYTICS_CACHE_TIMEOUT', 60 * 5)

            today = date.today()
            start_date = today - timedelta(days=7)

            popular_pages_query = DailyPageViewCount.objects.filter(
                date__gte=start_date
            ).exclude(
                url__in=aggregate_excluded_paths # Use dynamically loaded setting
            ).values('url').annotate(
                total_views=Sum('count')
            ).order_by('-total_views')[:5]

            popular_pages = list(popular_pages_query)
            cache.set(cache_key, popular_pages, cache_timeout)
        except Exception as e:
            logger.error(f"Failed to calculate popular pages: {e}", exc_info=True)
            popular_pages = []
    return popular_pages

def _get_page_specific_analytics(path: str) -> Dict[str, Any]:
    """
    Fetches analytics data specific to the current page path.
    (No settings needed here currently)
    """
    page_data = {
        'page_views_count': 0,
        'today_page_views': 0,
    }
    try:
        page_data['page_views_count'] = PageView.objects.filter(url=path).count()
        today = date.today()
        daily_count = DailyPageViewCount.objects.filter(url=path, date=today).first()
        page_data['today_page_views'] = daily_count.count if daily_count else 0
    except Exception as e:
        logger.error(f"Failed to get page-specific analytics for {path}: {e}", exc_info=True)
    return page_data


# --- Main Context Processor ---

def analytics_context(request: HttpRequest) -> Dict[str, Any]:
    """
    Adds analytics data to the template context, using caching and centralized settings.
    Reads settings dynamically via helper functions.
    """
    path = request.path

    # 1. Check if analytics should be displayed on this path at all
    # _should_display_analytics now reads the setting dynamically
    if not _should_display_analytics(path):
        return {}

    # 2. Prepare cache key for page-specific + global data bundle
    cache_key = f"analytics_context_data_{path}"
    context = cache.get(cache_key)

    if context is None:
        # 3. Get page-specific data
        page_data = _get_page_specific_analytics(path)

        # 4. Get site-wide data (helpers now read settings dynamically)
        total_views = _get_or_cache_total_views()
        unique_visitors = _get_or_cache_unique_visitors()
        popular_pages = _get_or_cache_popular_pages()

        # 5. Combine data into context dictionary
        context = {
            **page_data,
            'total_views': total_views,
            'unique_visitors': unique_visitors,
            'popular_pages': popular_pages,
        }

        # 6. Cache the combined context for this page
        # Get setting inside the function
        cache_timeout: int = getattr(settings, 'ANALYTICS_CACHE_TIMEOUT', 60 * 5)
        cache.set(cache_key, context, cache_timeout)

    return context