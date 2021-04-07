from django.contrib.auth.forms import UserCreationForm
from django.forms import Form, PasswordInput
from django.forms.fields import CharField, EmailField

from .models import EmailUser


class EmailUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = EmailUser
        fields = ["email"]


class EmailUserLoginForm(Form):
    email = EmailField()
    password = CharField(widget=PasswordInput)
