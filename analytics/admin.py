# analytics/admin.py
from django.contrib import admin
from .models import PageView, DailyPageViewCount, UniqueVisitor

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('url', 'ip_address', 'timestamp')
    list_filter = ('timestamp', 'url')
    search_fields = ('url', 'ip_address')

@admin.register(DailyPageViewCount)
class DailyPageViewCountAdmin(admin.ModelAdmin):
    list_display = ('url', 'date', 'count')
    list_filter = ('date', 'url')
    search_fields = ('url',)
    date_hierarchy = 'date'

@admin.register(UniqueVisitor)
class UniqueVisitorAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'first_visit', 'last_visit', 'visit_count', 'most_common_url')
    list_filter = ('first_visit', 'last_visit')
    search_fields = ('ip_address',)
    
    def most_common_url(self, obj):
        return obj.most_common_url()
    most_common_url.short_description = 'Most Common URL'
    most_common_url.admin_order_field = 'visit_count'
    most_common_url.allow_tags = True