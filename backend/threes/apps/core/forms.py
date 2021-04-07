from django.contrib.auth.forms import UserCreationForm
from django.forms import CharField, PasswordInput
from django.forms.models import ModelForm

from .models import EmailUser


class EmailUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = EmailUser
        fields = ["email"]


class EmailUserLoginForm(ModelForm):
    password = CharField(widget=PasswordInput)

    class Meta:
        model = EmailUser
        fields = ["email"]
