# api/models.py

from django.db import (
    models,
)
from django_spellbook.parsers import (
    render_spellbook_markdown_to_html,
)
import bleach  # Import bleach


class StoredMarkdown(models.Model):
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="An optional title for this Markdown content.",
    )
    markdown_content = models.TextField(help_text="The raw Markdown content.")
    html_content = models.TextField(
        blank=True,
        editable=False,
        help_text="The HTML rendered from the Markdown content by django-spellbook.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(
        self,
    ) -> str:
        return str(self.title or f"Markdown Content #{self.pk}")

    def save(
        self,
        *args,
        **kwargs,
    ):
        # Step 1: Attempt to sanitize the raw Markdown input to remove dangerous HTML tags
        # This applies bleach directly to the markdown_content string.
        # Note: This is an unconventional use of Bleach. Bleach is an HTML sanitizer.
        # Applying it to Markdown might strip legitimate Markdown constructs if they resemble HTML
        # or if you want to allow some HTML within your Markdown that Bleach might strip.

        # For this pre-sanitization of Markdown, you are deciding what HTML-like constructs
        # are "bad" within the Markdown itself. If your goal is primarily to remove <script> tags
        # from the Markdown before it's even processed by the Markdown parser:

        markdown_allowed_tags = [
            # Basic formatting often allowed in Markdown contexts if not using pure Markdown syntax
            "p",
            "br",
            "strong",
            "em",
            "u",
            "s",
            "sub",
            "sup",
            "div",
            "span",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "blockquote",
            "code",
            "pre",
            "hr",
            "a",
            "img",  # Allowing links and images as raw HTML in markdown
        ]
        markdown_allowed_attributes = {
            "a": [
                "href",
                "title",
            ],
            "img": [
                "src",
                "alt",
                "title",
            ],
        }

        # Clean the markdown_content. This will remove any HTML tags
        # not in markdown_allowed_tags (e.g., <script>).
        bleached_markdown = bleach.clean(
            str(self.markdown_content),
            tags=frozenset(markdown_allowed_tags),
            attributes=markdown_allowed_attributes,
            strip=True,  # Remove disallowed tags and their content
            strip_comments=True,
        )

        # Step 2: Render the (potentially) "bleached" Markdown to HTML using django-spellbook
        # Now, render_spellbook_markdown_to_html processes a version of the markdown
        # that has had certain HTML tags pre-emptively removed.
        self.html_content = render_spellbook_markdown_to_html(
            markdown_string=str(bleached_markdown),  # Use the bleached version
        )

        super().save(
            *args,
            **kwargs,
        )  # Call the "real" save() method.

    class Meta:
        verbose_name = "Stored Markdown Content"
        verbose_name_plural = "Stored Markdown Contents"
        ordering = ["-updated_at"]
