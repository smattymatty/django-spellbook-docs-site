# api/views.py
from rest_framework import viewsets, permissions
from .models import StoredMarkdown
from .serializers import StoredMarkdownSerializer
# from rest_framework.renderers import JSONRenderer # No longer needed here for this purpose

import logging
logger = logging.getLogger(__name__)

class StoredMarkdownViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows StoredMarkdown content to be viewed, created, edited, or deleted.
    """
    queryset = StoredMarkdown.objects.all().order_by('-updated_at')
    serializer_class = StoredMarkdownSerializer
    permission_classes = [permissions.AllowAny] # Changed to AllowAny for easier initial testing
    # renderer_classes = [JSONRenderer] # REMOVE THIS LINE to allow BrowsableAPIRenderer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context