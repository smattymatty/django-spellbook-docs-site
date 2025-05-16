# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoredMarkdownViewSet # Import your new ViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'stored-markdown', StoredMarkdownViewSet, basename='storedmarkdown')
# The 'basename' is optional but recommended if queryset is not set on the viewset or if you need to customize URL names.

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]