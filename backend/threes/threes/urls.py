from django.contrib import admin
from django.conf.urls import include
from django.urls import path

from rest_framework import routers

from apps.core.views import EmailUserViewSet, CookieTokenObtainPairView, CookieTokenRefreshView
from apps.tasks.views import TaskViewSet


router = routers.DefaultRouter()
router.register(r"tasks", TaskViewSet)
router.register(r"users", EmailUserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/", include(router.urls)),

    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),

    path("", include("apps.core.urls")),
    path("", include("apps.app.urls")),
]
