# api/models.py

from django.db import models
from django_spellbook.parsers import render_spellbook_markdown_to_html

class StoredMarkdown(models.Model):
    title = models.CharField(
        max_length=255, blank=True, null=True, 
        help_text="An optional title for this Markdown content."
        )
        
    markdown_content = models.TextField(help_text="The raw Markdown content.")
    html_content = models.TextField(
        blank=True, editable=False, 
        help_text="The HTML rendered from the Markdown content by django-spellbook."
        )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title or f"Markdown Content #{self.pk}"

    def save(self, *args, **kwargs):
        # Render HTML content whenever markdown_content changes or on initial save.
        self.html_content = render_spellbook_markdown_to_html(
            markdown_string=self.markdown_content,
        )
        super().save(*args, **kwargs) # Call the "real" save() method.

    class Meta:
        verbose_name = "Stored Markdown Content"
        verbose_name_plural = "Stored Markdown Contents"
        ordering = ['-updated_at']