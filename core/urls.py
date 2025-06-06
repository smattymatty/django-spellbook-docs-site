from django.contrib import (
    admin,
)
from django.urls import (
    path,
    include,
)
from django.conf import (
    settings,
)
from django.conf.urls.static import (
    static,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path(
        "a-panel/",
        admin.site.urls,
    ),
    path(
        "editor/",
        include("editor.urls"),
    ),
    path(
        "",
        include(
            "base.urls",
            namespace="base",
        ),
    ),
    path(
        "api/v1/",
        include("api.urls"),
    ),
    path(
        "",
        include("django_spellbook.urls"),
    ),
    ## JWT Tokens
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
] + static(
    settings.STATIC_URL,
    document_root=settings.STATIC_ROOT,
)
