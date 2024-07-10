from django.urls import path
from . import views

app_name = 'docs'  # This sets the namespace for the URLs

urlpatterns = [
    path('', views.home, name='home'),
    path('index/', views.grimoire_index, name='index'),
    path('search/', views.grimoire_search, name='search'),
    path('<path:path>/', views.grimoire_page, name='page'),
]
