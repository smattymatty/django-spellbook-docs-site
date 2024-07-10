from django.urls import path
from . import views

urlpatterns = [
    path('<path:path>', views.grimoire_page, name='grimoire_page'),
]
