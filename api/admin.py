# api/admin.py

from django.contrib import (
    admin,
)
from .models import (
    StoredMarkdown,
)


@admin.register(StoredMarkdown)
class StoredMarkdownAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "created_at",
        "updated_at",
    )
    search_fields = (
        "title",
        "markdown_content",
    )
    readonly_fields = (
        "html_content",
        "created_at",
        "updated_at",
    )  # html_content is auto-generated

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "markdown_content",
                )
            },
        ),
        (
            "Generated Content & Timestamps",
            {
                "fields": (
                    "html_content",
                    "created_at",
                    "updated_at",
                ),
                "classes": (
                    "collapse",
                ),  # Makes this section collapsible in admin
            },
        ),
    )
