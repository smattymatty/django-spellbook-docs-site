# api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404 # For detail view
from django.template.loader import render_to_string
from django.shortcuts import render

from .models import StoredMarkdown
from .serializers import StoredMarkdownSerializer

# This would be for a list/create endpoint
class StoredMarkdownListCreateAPIView(APIView):
    """
    API endpoint that allows StoredMarkdown content to be viewed, created, edited, or deleted.
    
POST JSON format example:
     
        {
            "title": "My Markdown Title",
            "markdown_content": "# My Markdown Content"
        }

REQUIRED_ARGUMENTS: markdown_content
OPTIONAL_ARGUMENTS: title
READ_ONLY_ARGUMENTS: html_content, created_at, updated_at, id, url
    
    """
    permission_classes = [permissions.AllowAny] # Example permission

    def get_serializer_context(self):
        # Helper to pass request to serializer
        return {'request': self.request}

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to list all StoredMarkdown items.
        (Corresponds to ModelViewSet's list action)
        """
        queryset = StoredMarkdown.objects.all().order_by('-updated_at')
        serializer = StoredMarkdownSerializer(queryset, many=True, context=self.get_serializer_context())
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to create a new StoredMarkdown item.
        (Corresponds to ModelViewSet's create action)
        """
        serializer = StoredMarkdownSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save() # This will call serializer.create()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# This would be for a retrieve/update/delete endpoint
class StoredMarkdownDetailAPIView(APIView):
    permission_classes = [permissions.AllowAny] # Example permission

    def get_serializer_context(self):
        return {'request': self.request}

    def get_object(self, pk):
        return get_object_or_404(StoredMarkdown, pk=pk)

    def get(self, request, pk, *args, **kwargs):
        """
        Handle GET requests to retrieve a single StoredMarkdown item.
        (Corresponds to ModelViewSet's retrieve action)
        """
        instance = self.get_object(pk)
        serializer = StoredMarkdownSerializer(instance, context=self.get_serializer_context())
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        """
        Handle PUT requests to update a StoredMarkdown item.
        (Corresponds to ModelViewSet's update action)
        """
        instance = self.get_object(pk)
        serializer = StoredMarkdownSerializer(instance, data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save() # This will call serializer.update()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        """
        Handle DELETE requests to remove a StoredMarkdown item.
        (Corresponds to ModelViewSet's destroy action)
        """
        instance = self.get_object(pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RenderedMarkdownDetailAPIView(APIView):
    """
    API endpoint that simply shows the rendered HTML for a StoredMarkdown item.
    Uses Django's built-in render_to_string() function.
    
    """
    permission_classes = [permissions.AllowAny] # Example permission

    def get_serializer_context(self):
        return {'request': self.request}

    def get_object(self, pk):
        return get_object_or_404(StoredMarkdown, pk=pk)

    def get(self, request, pk, *args, **kwargs):
        """
        Handle GET requests to retrieve a single StoredMarkdown item.
        (Corresponds to ModelViewSet's retrieve action)
        """
        instance = self.get_object(pk)
        rendered_html = instance.html_content
        
        return render(request, 'api/sb_base.html', {'markdown_content': rendered_html})