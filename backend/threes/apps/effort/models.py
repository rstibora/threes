from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.fields import related

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
    owner = models.OneToOneField(EmailUser, on_delete=models.CASCADE)
    task = models.OneToOneField(Task, primary_key=True, on_delete=models.CASCADE)

    description = models.CharField(blank=True, default="", max_length=512)
    last_active = models.DateTimeField()

    class Meta:
        unique_together = ["owner", "task"]

    def __repr__(self) -> str:
        return (f"{self.__class__.__name__}({self.owner},{self.task},{self.description},"
                f"{self.last_active})")


class EffortSessionEvent(models.Model):
    class EventChoices(models.TextChoices):
        START = "S"
        PAUSE = "P"

    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE)
    session = models.ForeignKey(EffortSession, on_delete=models.CASCADE,
                                related_name="events_set")

    event = models.CharField(max_length=1, choices=EventChoices.choices)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.owner},{self.event},{self.session})"
