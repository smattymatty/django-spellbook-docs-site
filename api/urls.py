# URL configuration for the API endpoints
from django.urls import path
from .views import StoredMarkdownListCreateAPIView, StoredMarkdownDetailAPIView, RenderedMarkdownDetailAPIView

urlpatterns = [
    path('stored-markdown/', StoredMarkdownListCreateAPIView.as_view(), name='storedmarkdown-list-create'),
    path('stored-markdown/<int:pk>/', StoredMarkdownDetailAPIView.as_view(), name='storedmarkdown-detail'),
    path('rendered-markdown/<int:pk>/', RenderedMarkdownDetailAPIView.as_view(), name='renderedmarkdown-detail'),
]