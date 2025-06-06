# api/serializers.py

from rest_framework import (
    serializers,
)
from .models import (
    StoredMarkdown,
)
# Your StoredMarkdown model's save() method already generates html_content.


class StoredMarkdownSerializer(serializers.HyperlinkedModelSerializer):
    # This field provides the actual rendered HTML string within the JSON response.
    html_content = serializers.CharField(read_only=True)

    # Explicitly define the hyperlink to the DRF object detail view.
    # Let's call it 'api_url' for clarity.
    api_url = serializers.HyperlinkedIdentityField(
        view_name="storedmarkdown-detail",  # Matches the name in your api/urls.py
        lookup_field="pk",
    )

    # Add a new hyperlink to the page that renders the HTML content within your base template.
    rendered_html_page_url = serializers.HyperlinkedIdentityField(
        view_name="renderedmarkdown-detail",  # Matches the name in your api/urls.py
        lookup_field="pk",
    )

    class Meta:
        model = StoredMarkdown
        fields = [
            "api_url",  # Link to the DRF detail view for this object
            "rendered_html_page_url",  # Link to the user-facing HTML page for this content
            "id",  # Still useful to have the ID
            "title",
            "markdown_content",  # The raw markdown
            "html_content",  # The rendered HTML string
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "html_content",
            "created_at",
            "updated_at",
        ]
        # 'id', 'api_url', and 'rendered_html_page_url' are also effectively read-only as they are generated.

        # Note: By explicitly defining `api_url` and `rendered_html_page_url` above,
        # we don't need `extra_kwargs` for a default 'url' field anymore.
        # If we had just put 'url' in fields, we might have used extra_kwargs
        # to point it to 'storedmarkdown-detail'.
