# analytics/admin.py
from django.contrib import admin
from django.db.models import Sum # Import Sum for aggregation
from django.urls import reverse
from django.utils.html import format_html
from .models import PageView, DailyPageViewCount, UniqueVisitor

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    # Display more relevant info, make URL clickable (if you have detail views)
    list_display = (
        'url', 
        'ip_address', 
        'timestamp',
        'is_bot',
        'truncated_user_agent'
        )
    # Add date hierarchy for easy navigation by time
    date_hierarchy = 'timestamp'
    # Filtering by URL can be useful if you have many distinct URLs
    list_filter = ('timestamp', 'url')
    search_fields = ('url', 'ip_address', 'user_agent')
    # Page view data is typically immutable from the admin
    readonly_fields = ('url', 'ip_address', 'user_agent', 'timestamp')
    # Add pagination
    list_per_page = 25
    
    def is_bot(self, obj):
        if 'bot' in obj.user_agent.lower():
            return True
        return False
    is_bot.short_description = 'Is Bot'

    def truncated_user_agent(self, obj):
        # Show only the first 50 chars of the user agent for cleaner display
        if obj.user_agent:
            return obj.user_agent[:50] + '...' if len(obj.user_agent) > 50 else obj.user_agent
        return '-'
    truncated_user_agent.short_description = 'User Agent (Truncated)'
    

@admin.register(DailyPageViewCount)
class DailyPageViewCountAdmin(admin.ModelAdmin):
    list_display = ('date', 'url', 'count')
    # Date hierarchy is already good
    date_hierarchy = 'date'
    # Add ordering for clarity
    ordering = ('-date', 'url')
    list_filter = ('date', 'url')
    search_fields = ('url',)
    # This data is aggregated, so make it read-only
    readonly_fields = ('url', 'date', 'count')
    list_per_page = 30

    # Optional: Prevent adding/deleting aggregated data
    # def has_add_permission(self, request):
    #     return False
    # def has_delete_permission(self, request, obj=None):
    #     return False

    # Optional: Add a total count in the list view
    # Note: This can be slow on very large datasets
    # def changelist_view(self, request, extra_context=None):
    #     response = super().changelist_view(request, extra_context=extra_context)
    #     try:
    #         qs = response.context_data['cl'].queryset
    #         total_views = qs.aggregate(Sum('count'))['count__sum']
    #         response.context_data['total_views'] = total_views
    #     except (AttributeError, KeyError):
    #         pass # Handle cases where queryset might not be available
    #     return response


@admin.register(UniqueVisitor)
class UniqueVisitorAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'first_visit', 'last_visit', 'visit_count', 'most_frequent_url_link')
    # Add date hierarchy for easier filtering by visit time
    date_hierarchy = 'last_visit'
    list_filter = ('first_visit', 'last_visit')
    search_fields = ('ip_address', 'user_agent')
    # Make most fields read-only as they are tracked automatically
    # visit_count could potentially be editable if manual adjustments are needed, but often best left read-only
    readonly_fields = ('ip_address', 'user_agent', 'first_visit', 'last_visit', 'visit_count', 'most_frequent_url_display')
    # Order by most recent visitors or highest visit count
    ordering = ('-last_visit',)
    list_per_page = 25

    # Use fieldsets to organize the detail view
    fieldsets = (
        ('Visitor Info', {
            'fields': ('ip_address', 'user_agent')
        }),
        ('Visit History', {
            'fields': ('first_visit', 'last_visit', 'visit_count', 'most_frequent_url_display')
        }),
    )

    # Method to display the most frequent URL (no link needed in readonly_fields)
    def most_frequent_url_display(self, obj):
        url = obj.most_common_url()
        return url if url else '-'
    most_frequent_url_display.short_description = 'Most Frequent URL'

    # Method for the list_display with a link (if possible/desired)
    def most_frequent_url_link(self, obj):
        url = obj.most_common_url()
        if url:
            # If you had a view to show details for a specific URL's traffic, you could link it:
            # url_detail_link = reverse('admin:analytics_url_detail', args=[url]) # Example URL name
            # return format_html('<a href="{}">{}</a>', url_detail_link, url)
            return url # Return just the URL if no detail view exists
        return '-'
    most_frequent_url_link.short_description = 'Most Frequent URL'
    # Allow sorting by visit count when clicking the header
    most_frequent_url_link.admin_order_field = 'visit_count'

    # Optional: Prevent adding/deleting visitors manually
    # def has_add_permission(self, request):
    #     return False
    # def has_delete_permission(self, request, obj=None):
    #     return False