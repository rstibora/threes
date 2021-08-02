from django.contrib import admin
from django.conf.urls import include
from django.urls import path

from rest_framework import routers

from apps.core.views import CookieTokenObtainPairView, CookieTokenRefreshView, EmailUserViewSet
from apps.effort.views import EffortViewSet
from apps.reviews.views import (
    ReviewConfigurationViewSet, ReviewViewSet, UserReviewConfigurationViewSet)
from apps.tasks.views import TaskViewSet


router = routers.DefaultRouter()
router.register(r"efforts", EffortViewSet, basename=r"effort")
router.register(r"tasks", TaskViewSet, basename=r"task")
router.register(r"users", EmailUserViewSet, basename=r"user")
router.register(r"review_configurations", ReviewConfigurationViewSet,
                basename=r"reviewconfiguration")
router.register(r"user_review_configuration", UserReviewConfigurationViewSet,
                basename=r"userreviewperiod")
router.register(r"reviews", ReviewViewSet, basename=r"review")

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),

    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),

    path("", include("apps.core.urls")),
    path("", include("apps.app.urls")),
]
