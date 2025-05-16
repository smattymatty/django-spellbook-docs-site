# api/admin.py

from django.contrib import admin
from .models import StoredMarkdown

@admin.register(StoredMarkdown)
class StoredMarkdownAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title', 'markdown_content')
    readonly_fields = ('html_content', 'created_at', 'updated_at') # html_content is auto-generated
    
    fieldsets = (
        (None, {
            'fields': ('title', 'markdown_content')
        }),
        ('Generated Content & Timestamps', {
            'fields': ('html_content', 'created_at', 'updated_at'),
            'classes': ('collapse',), # Makes this section collapsible in admin
        }),
    )

    # Note: The html_content won't be auto-updated in the admin *form* when you change
    # markdown_content and hit "Save" in the admin, unless you add custom JavaScript
    # or a more complex admin setup. The API will handle it correctly because the
    # serializer's create/update methods are called.
    # If you save via Admin, the model's save() method would need to handle HTML generation
    # if the serializer isn't involved. For consistency, it might be better to ensure
    # html_content generation is always tied to where markdown_content is set.
    #
    # For admin saves to also trigger the HTML generation via the serializer logic,
    # that's not direct. The admin uses model forms. A signal (post_save) or overriding
    # the model's save() method (as initially considered) would ensure admin changes
    # also re-render HTML.
    # Let's add the save() method override back to the model for admin consistency.