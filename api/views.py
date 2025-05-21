# api/views.py

from django.conf import settings
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404 # For detail view
from django.shortcuts import render # Used in RenderedMarkdownDetailAPIView

from .models import StoredMarkdown
from .serializers import StoredMarkdownSerializer

class PayloadTooLarge(APIException):
    status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    default_detail = "Payload Too Large"
    default_code = "payload_too_large"

class BaseCustomAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Default permissions

    def get_serializer_context(self):
        return {'request': self.request}

    def check_request_size(self, request, max_size_setting_name='MAX_API_REQUEST_SIZE', default_max_size=settings.DATA_UPLOAD_MAX_MEMORY_SIZE): # Using DATA_UPLOAD_MAX_MEMORY_SIZE as default
        try:
            content_length = int(request.META.get('CONTENT_LENGTH', 0))
            print(f"[DEBUG] Content-Length: {content_length} ---- -")
        except (ValueError, TypeError):
            return
        max_size = getattr(settings, max_size_setting_name, default_max_size)
        print(f"[DEBUG] MAX_API_REQUEST_SIZE: {max_size} ---- -")
        if content_length > max_size:
            raise PayloadTooLarge(f"Payload size ({content_length} bytes) exceeds configured limit ({max_size} bytes).")
        print(f"[DEBUG] Payload size ({content_length} bytes) is within limit ({max_size} bytes). -- ---")
# --- Views that handle Markdown content ---

class StoredMarkdownListCreateAPIView(BaseCustomAPIView):
    """
    List and create StoredMarkdown objects.
    Inherits from BaseCustomAPIView to provide permission_classes and get_serializer_context.
    """
    def get(self, request, *args, **kwargs):
        queryset = StoredMarkdown.objects.all().order_by('-updated_at')
        serializer = StoredMarkdownSerializer(queryset, many=True, context=self.get_serializer_context())
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        try:
            self.check_request_size(request, max_size_setting_name='MAX_API_REQUEST_SIZE')
        except PayloadTooLarge as e:
            return Response({"detail": str(e)}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)

        serializer = StoredMarkdownSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StoredMarkdownDetailAPIView(BaseCustomAPIView):
    # get_serializer_context is inherited
    # permission_classes is inherited

    #  define get_object here as it's specific to this detail view
    def get_object(self, pk):
        """
        Helper method to get the object with the given pk or raise a 404.
        """
        return get_object_or_404(StoredMarkdown, pk=pk)

    def get(self, request, pk, *args, **kwargs):
        instance = self.get_object(pk) # Now self.get_object exists
        serializer = StoredMarkdownSerializer(instance, context=self.get_serializer_context())
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        try:
            self.check_request_size(request, max_size_setting_name='MAX_API_REQUEST_SIZE')
        except PayloadTooLarge as e:
            return Response({"detail": str(e)}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
            
        instance = self.get_object(pk) # Now self.get_object exists
        serializer = StoredMarkdownSerializer(instance, data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        instance = self.get_object(pk) # Now self.get_object exists
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RenderedMarkdownDetailAPIView(APIView): # This one doesn't need BaseCustomAPIView features
    permission_classes = [permissions.IsAuthenticated]

    # No get_serializer_context needed as it doesn't use a DRF serializer for output
    # No check_request_size needed as it's a GET request with no body to check

    # Must define get_object here as it's specific to this detail view
    def get_object(self, pk):
        return get_object_or_404(StoredMarkdown, pk=pk)

    def get(self, request, pk, *args, **kwargs):
        instance = self.get_object(pk)
        rendered_html = instance.html_content
        # Pass the instance to the template context so you can use instance.title etc.
        return render(request, 'api/sb_base.html', {'markdown_content': rendered_html, 'instance': instance})