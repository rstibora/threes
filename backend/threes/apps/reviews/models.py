from django.db import models
from django.db.models.base import ModelState

from apps.core.models import EmailUser
from apps.tasks.models import Task


class ReviewPeriodDuration(models.Model):
    DAY = "D"
    WEEK = "W"
    MONTH = "M"
    YEAR = "Y"
    BASE_DURATION_CHOICES = [
        (DAY, "Day"),
        (WEEK, "Week"),
        (MONTH, "Month"),
        (YEAR, "Year")]

    base_duration = models.CharField(max_length=1, choices=BASE_DURATION_CHOICES)
    multiplier = models.IntegerField()

    # Predefined durations should have no owner.
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, null=True)


class ReviewPeriodConfiguration(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE,
                              related_name="review_period_configurations")

    name = models.CharField(max_length=64)
    starts = models.DateTimeField()
    inteval = models.ForeignKey(ReviewPeriodDuration, on_delete=models.PROTECT)


class ReviewPeriod(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="review_periods")
    configuration = models.ForeignKey(ReviewPeriodConfiguration, on_delete=models.PROTECT)

    planned_tasks = models.ManyToManyField(Task, related_name="review_periods")

    starts = models.DateTimeField()
    ends = models.DateTimeField()
