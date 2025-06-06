from django.shortcuts import (
    render,
)
from django.http import (
    Http404,
)
from django.conf import (
    settings,
)

from django_spellbook.views import (
    TOC,
)


def home(
    request,
):
    context = {"toc": TOC}

    return render(
        request,
        "docs/home.html",
        context,
    )
