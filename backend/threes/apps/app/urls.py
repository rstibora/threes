from django.urls import path

from . import views


urlpatterns = [
    path("app/", views.AppView.as_view(), name="app")
]
