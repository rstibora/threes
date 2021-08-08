from django.http.response import HttpResponseBadRequest
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate

from rest_framework import permissions, viewsets

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from infra.http_method import HttpMethod

from .forms import EmailUserCreationForm, EmailUserLoginForm
from .models import EmailUser
from .serializers import (
    CookieTokenRefreshSerializer, EmailUserSerializer, EmailUserTokenObtainPairSerializer)


def signup(request):
    if request.method == HttpMethod.POST.value:
        form = EmailUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            refresh_token = RefreshToken.for_user(user)
            refresh_token["email"] = user.email
            refresh_token["date_joined"] = user.date_joined.isoformat()
            response = redirect("app")
            response.set_cookie("refresh_token", str(refresh_token))
            return response
    else:
        form = EmailUserCreationForm()

    return render(request, "core/signup.html", {"form": form})


def signin(request):
    if request.method == HttpMethod.POST.value:
        form = EmailUserLoginForm(request.POST)
        if form.is_valid():
            user = authenticate(request, email=request.POST["email"],
                                password=request.POST["password"])
            if user is not None:
                refresh_token = RefreshToken.for_user(user)
                refresh_token["email"] = user.email
                refresh_token["date_joined"] = user.date_joined.isoformat()
                response = redirect("app")
                response.set_cookie("refresh_token", str(refresh_token))
                return response
    else:
        form = EmailUserLoginForm()

    return render(request, "core/signin.html", {"form": form})


def logout(request):
    if request.method == HttpMethod.POST.value:
        response = redirect("signin")
        response.delete_cookie("refresh_token")
        return response
    return HttpResponseBadRequest()


class EmailUserViewSet(viewsets.ModelViewSet):
    queryset = EmailUser.objects.all()
    serializer_class = EmailUserSerializer
    # TODO: change to authenticated only.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Copied from https://github.com/jazzband/django-rest-framework-simplejwt/issues/71.
class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age,
                                httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = EmailUserTokenObtainPairSerializer


# Copied from https://github.com/jazzband/django-rest-framework-simplejwt/issues/71.
class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age,
                                httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenRefreshSerializer
