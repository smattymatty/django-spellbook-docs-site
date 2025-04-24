from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('a-panel/', admin.site.urls),
    path('', include('base.urls', namespace='base')),
    path('', include('django_spellbook.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
