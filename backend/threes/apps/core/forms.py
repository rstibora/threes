from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import EmailUser


class EmailUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = EmailUser
        fields = ["email"]
