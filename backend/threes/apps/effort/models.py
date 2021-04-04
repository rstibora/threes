from django.db import models

from apps.core.models import EmailUser
from apps.tasks.models import Task


class Effort(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="effort_set")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="effort_set")

    started = models.DateTimeField()
    ended = models.DateTimeField()

    class Meta:
        indexes = [models.Index(fields=["-ended"])]
