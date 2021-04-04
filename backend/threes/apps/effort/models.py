from django.db import models

from apps.core.models import EmailUser
from apps.reviews.models import ReviewPeriod
from apps.tasks.models import Task


class Effort(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="effort_set")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="effort_set")
    review_period = models.ForeignKey(ReviewPeriod, null=True, on_delete=models.PROTECT,
                                      related_name="effort_set")

    started = models.DateTimeField()
    ended = models.DateTimeField()

    class Meta:
        indexes = [models.Index(fields=["-ended"])]
