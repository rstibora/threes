from django.contrib import admin
from django.conf.urls import include
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),

    path("", include("apps.core.urls")),
    path("", include("apps.app.urls")),
    path("tasks/", include("apps.tasks.urls")),
]
