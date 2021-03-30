from django.shortcuts import redirect, render
from django.contrib.auth import login
from django.contrib.auth.views import LoginView

from rest_framework import permissions, viewsets

from infra.http_method import HttpMethod

from .forms import EmailUserCreationForm
from .models import EmailUser
from .serializers import EmailUserSerializer


def signup(request):
    if request.method == HttpMethod.POST.value:
        form = EmailUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            redirect("app")
    else:
        form = EmailUserCreationForm()

    return render(request, "core/signup.html", {"form": form})


class SignInView(LoginView):
    template_name = "core/signin.html"


class EmailUserViewSet(viewsets.ModelViewSet):
    queryset = EmailUser.objects.all()
    serializer_class = EmailUserSerializer
    # TODO: change to authenticated only.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
