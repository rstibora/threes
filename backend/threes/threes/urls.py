from django.contrib import admin
from django.conf.urls import include
from django.urls import path

from rest_framework import routers

from apps.core.views import EmailUserViewSet, CookieTokenObtainPairView, CookieTokenRefreshView
from apps.tasks.views import TaskDetail, TaskList


# router = routers.DefaultRouter()
# router.register(r"tasks", task_list)
# router.register(r"users", EmailUserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # path("api/", include(router.urls)),
    path("api/tasks/", TaskList.as_view()),
    path("api/tasks/<int:pk>", TaskDetail.as_view()),

    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),

    path("", include("apps.core.urls")),
    path("", include("apps.app.urls")),
]
