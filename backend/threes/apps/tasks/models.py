from django.db import models

from django.contrib.auth.models import User


class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=512)

    class Status(models.TextChoices):
        BACKLOG = "B"
        COMPLETE = "C"
        IN_PROGRESS = "I"

    status = models.CharField(max_length=1, choices=Status.choices, default=Status.BACKLOG)
