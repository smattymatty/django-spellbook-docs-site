from django.urls import path
from . import views

app_name = "RPG"

urlpatterns = [
    path("", views.index, name="index"),
    # -- HTMX Views -- #
    path("htmx/welcome", views.welcome_screen, name="welcome_screen"),
]
