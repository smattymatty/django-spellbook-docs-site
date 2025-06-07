from django.shortcuts import render


# -- INDEX VIEW -- #


def index(request):
    template = "RPG/base.html"
    context = {"hide_editor_button_from_banner": True}
    return render(request, template, context)


# -- HTMX VIEWS -- #


def welcome_screen(request):
    template = "RPG/screens/welcome.html"
    context = {}
    return render(request, template, context)
