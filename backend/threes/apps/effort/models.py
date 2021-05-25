from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import EmailUser
from apps.tasks.models import Task


class Effort(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="effort_set")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="effort_set")

    starts = models.DateTimeField()

    duration = models.IntegerField()  # [minutes]

    class Meta:
        indexes = [models.Index(fields=["-starts"])]

    def clean(self) -> None:
        if self.task.owner != self.owner:
            raise ValidationError("Task has to be owned by the owner of the effort", code="invalid")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
