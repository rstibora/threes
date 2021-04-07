from django.shortcuts import redirect, render
from django.contrib.auth import authenticate
from django.contrib.auth.views import LoginView

from rest_framework import permissions, viewsets
from rest_framework_simplejwt.tokens import RefreshToken

from infra.http_method import HttpMethod

from .forms import EmailUserCreationForm, EmailUserLoginForm
from .models import EmailUser
from .serializers import EmailUserSerializer


def signup(request):
    if request.method == HttpMethod.POST.value:
        form = EmailUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            refresh_token = RefreshToken.for_user(user)
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
                response = redirect("app")
                response.set_cookie("refresh_token", str(refresh_token))
                return response
    else:
        form = EmailUserLoginForm()

    return render(request, "core/signin.html", {"form": form})


class EmailUserViewSet(viewsets.ModelViewSet):
    queryset = EmailUser.objects.all()
    serializer_class = EmailUserSerializer
    # TODO: change to authenticated only.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
