from django.db import models

from apps.core.models import EmailUser


class Task(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=64)
