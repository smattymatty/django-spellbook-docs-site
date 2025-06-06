# analytics/admin.py
from django.contrib import admin
from .models import PageView, DailyPageViewCount, UniqueVisitor


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    # Display more relevant info, make URL clickable (if you have detail views)
    list_display = (
        "url",
        "ip_address",
        "timestamp",
        "is_bot",
        "truncated_user_agent",
    )
    # Add date hierarchy for easy navigation by time
    date_hierarchy = "timestamp"
    # Filtering by URL can be useful if you have many distinct URLs
    list_filter = ("timestamp", "url")
    search_fields = ("url", "ip_address", "user_agent")
    # Page view data is typically immutable from the admin
    readonly_fields = ("url", "ip_address", "user_agent", "timestamp")
    # Add pagination
    list_per_page = 25

    @admin.display(description="Is Bot")
    def is_bot(self, obj):
        if "bot" in obj.user_agent.lower():
            return True
        return False

    @admin.display(description="User Agent (Truncated)")
    def truncated_user_agent(self, obj):
        # Show only the first 50 chars of the user agent for cleaner display
        if obj.user_agent:
            return (
                obj.user_agent[:50] + "..."
                if len(obj.user_agent) > 50
                else obj.user_agent
            )
        return "-"


@admin.register(DailyPageViewCount)
class DailyPageViewCountAdmin(admin.ModelAdmin):
    list_display = ("date", "url", "count")
    # Date hierarchy is already good
    date_hierarchy = "date"
    # Add ordering for clarity
    ordering = ("-date", "url")
    list_filter = ("date", "url")
    search_fields = ("url",)
    # This data is aggregated, so make it read-only
    readonly_fields = ("url", "date", "count")
    list_per_page = 30


@admin.register(UniqueVisitor)
class UniqueVisitorAdmin(admin.ModelAdmin):
    list_display = (
        "ip_address",
        "first_visit",
        "last_visit",
        "visit_count",
        "most_frequent_url_link",
    )
    # Add date hierarchy for easier filtering by visit time
    date_hierarchy = "last_visit"
    list_filter = ("first_visit", "last_visit")
    search_fields = ("ip_address", "user_agent")
    # Make most fields read-only as they are tracked automatically
    readonly_fields = (
        "ip_address",
        "user_agent",
        "first_visit",
        "last_visit",
        "visit_count",
        "most_frequent_url_display",
    )
    # Order by most recent visitors or highest visit count
    ordering = ("-last_visit",)
    list_per_page = 25

    # Use fieldsets to organize the detail view
    fieldsets = (  # type: ignore[assignment]
        ("Visitor Info", {"fields": ("ip_address", "user_agent")}),
        (
            "Visit History",
            {
                "fields": (
                    "first_visit",
                    "last_visit",
                    "visit_count",
                    "most_frequent_url_display",
                )
            },
        ),
    )

    @admin.display(description="Most Frequent URL")
    def most_frequent_url_display(self, obj):
        url = obj.most_common_url()
        return url if url else "-"

    @admin.display(description="Most Frequent URL")
    def most_frequent_url_link(self, obj):
        url = obj.most_common_url()
        if url:
            return url  # Return just the URL if no detail view exists
        return "-"
