# analytics/context_processors.py
from django.utils import timezone
from datetime import date, timedelta
from django.core.cache import cache
from django.db import models
from .models import PageView, DailyPageViewCount, UniqueVisitor

def analytics_context(request):
    """
    Add analytics data to the template context with caching.
    """
    context = {}
    
    # Define paths to exclude from analytics display
    excluded_paths = ['/', '/favicon.ico', '/sw.js']
    
    # Only process if not an admin, static, or analytics path
    if (not request.path.startswith('/admin/') and 
        not request.path.startswith('/static/') and
        not request.path.startswith('/analytics/') and
        not request.path.startswith('/wp-admin/') and
        not request.path.startswith('/wp-includes/') and
        not request.path.startswith('/wp-content/') and
        not request.path.startswith('/wordpress/')
        ):
        
        # Cache key specific to this page
        cache_key = f"analytics_data_{request.path}"
        cached_data = cache.get(cache_key)
        
        if cached_data is None:
            # Current page view count (all time)
            page_views_count = PageView.objects.filter(url=request.path).count()
            
            # Current page view count (today)
            today = date.today()
            try:
                daily_count = DailyPageViewCount.objects.get(url=request.path, date=today)
                today_page_views = daily_count.count
            except DailyPageViewCount.DoesNotExist:
                today_page_views = 0
            
            # Total site views
            total_views = cache.get("total_site_views")
            if total_views is None:
                total_views = PageView.objects.exclude(url__in=excluded_paths).count()
                cache.set("total_site_views", total_views, 60 * 5)  # Cache for 5 minutes
            
            # Total unique visitors
            unique_visitors = cache.get("unique_visitors")
            if unique_visitors is None:
                unique_visitors = UniqueVisitor.objects.count()
                cache.set("unique_visitors", unique_visitors, 60 * 5)  # Cache for 5 minutes
            
            # Get the most popular pages (top 5) - cached separately
            popular_pages = cache.get("popular_pages")
            if popular_pages is None:
                popular_pages = list(DailyPageViewCount.objects.filter(
                    date__gte=today - timedelta(days=7)
                ).exclude(
                    url__in=excluded_paths  # Exclude the specified paths
                ).values('url').annotate(
                    total_views=models.Sum('count')
                ).order_by('-total_views')[:5])
                cache.set("popular_pages", popular_pages, 60 * 5)  # Cache for 5 minutes
            
            context = {
                'page_views_count': page_views_count,
                'today_page_views': today_page_views,
                'total_views': total_views,
                'unique_visitors': unique_visitors,
                'popular_pages': popular_pages,
            }
            
            # Cache the analytics data for this page for 5 minutes
            cache.set(cache_key, context, 60 * 5)
        else:
            context = cached_data
    
    return context