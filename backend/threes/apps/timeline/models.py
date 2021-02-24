from django.db import models

from django.contrib.auth.models import User

from apps.tasks.models import Task


class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks_progress")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="progress")

    start = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField()  # In minutes.

    comment = models.CharField(max_length=64)
