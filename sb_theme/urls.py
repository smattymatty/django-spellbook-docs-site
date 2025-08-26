from django.urls import path
from . import views

app_name = 'sb_theme'

urlpatterns = [
    path('themes/', views.theme_switcher, name='theme-switcher'),
    path('themes/set/', views.set_theme, name='set-theme'),
    path('themes/reset/', views.reset_theme, name='reset-theme'),
    path('theme-builder/', views.theme_builder, name='theme-builder'),
    path('api/toggle-mode/', views.toggle_mode, name='toggle-mode'),
]