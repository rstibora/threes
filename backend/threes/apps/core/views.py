from django.shortcuts import redirect, render
from django.contrib.auth import login
from django.contrib.auth.views import LoginView

from infra.http_method import HttpMethod

from .forms import EmailUserCreationForm


def signup(request):
    if request.method == HttpMethod.POST.value:
        form = EmailUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            redirect("frontpage")
    else:
        form = EmailUserCreationForm()

    return render(request, "core/signup.html", {"form": form})


class SignInView(LoginView):
    template_name = "core/signin.html"
