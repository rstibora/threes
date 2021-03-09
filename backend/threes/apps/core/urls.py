from django.urls import path

from . import views


urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("signin/", views.SignInView.as_view(), name="login"),
]
