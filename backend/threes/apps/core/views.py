from django.shortcuts import redirect, render
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm

from infra.http_method import HttpMethod


def signup(request):
    if request.method == HttpMethod.POST.value:
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            redirect("frontpage")
    else:
        form = UserCreationForm()

    return render(request, "core/signup.html", {"form": form})
