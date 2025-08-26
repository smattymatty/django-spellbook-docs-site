from django.shortcuts import (
    render,
)


def editor_base(
    request,
):
    template_name = "editor/base.html"
    context = {
        "hide_editor_button_from_banner": True,
        "hide_themes_button_from_banner": False,
    }
    return render(
        request,
        template_name,
        context,
    )
