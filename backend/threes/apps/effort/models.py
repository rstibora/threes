from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import EmailUser
from apps.tasks.models import Task


class Effort(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="effort_set")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="effort_set")

    starts = models.DateTimeField()
    duration = models.IntegerField()  # [seconds]

    description = models.CharField(blank=True, default="", max_length=512)

    class Meta:
        indexes = [models.Index(fields=["-starts"])]

    def clean(self) -> None:
        if self.task.owner != self.owner:
            raise ValidationError("Task has to be owned by the owner of the effort", code="invalid")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.owner}, {self.task}, {self.starts}, {self.duration}, {self.description}"


class EffortSession(models.Model):
    class StateChoices(models.TextChoices):
        RUNNING = "R"
        PAUSED = "P"

    owner = models.OneToOneField(EmailUser, on_delete=models.CASCADE)
    task = models.OneToOneField(Task, on_delete=models.CASCADE)

    state = models.CharField(max_length=1, choices=StateChoices.choices)
    last_active = models.DateTimeField()
    duration = models.IntegerField()  # [seconds]
    created = models.DateTimeField(auto_now_add=True)

    description = models.CharField(blank=True, default="", max_length=512)

    def __repr__(self) -> str:
        return (f"{self.__class__.__name__}({self.task},{self.last_active})")
