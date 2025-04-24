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
    list_display = ('ip_address', 'first_visit', 'last_visit', 'visit_count')
    list_filter = ('first_visit', 'last_visit')
    search_fields = ('ip_address',)