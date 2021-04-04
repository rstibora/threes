from django.db import models

from apps.core.models import EmailUser
from apps.tasks.models import Task


class ReviewPeriodConfiguration(models.Model):
    DAY = "D"
    WEEK = "W"
    MONTH = "M"
    YEAR = "Y"
    BASE_DURATION_CHOICES = [
        (DAY, "Day"),
        (WEEK, "Week"),
        (MONTH, "Month"),
        (YEAR, "Year")]

    WEEK_NUM = "WN"
    MONTH_NAME = "MN"
    INT = "IN"
    INDEX_CHOICES = [
        (WEEK_NUM, "Week Number"),
        (MONTH_NAME, "Month Name"),
        (INT, "Integer Index")]

    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE,
                              related_name="review_period_configurations")

    name = models.CharField(max_length=64)

    base_duration = models.CharField(max_length=1, choices=BASE_DURATION_CHOICES)
    multiplier = models.IntegerField()

    starts = models.DateTimeField()
    index_type = models.CharField(max_length=2, choices=INDEX_CHOICES)
    index_reset_duration = models.CharField(max_length=1, choices=BASE_DURATION_CHOICES)


class ReviewPeriod(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="review_periods")
    configuration = models.ForeignKey(ReviewPeriodConfiguration, on_delete=models.PROTECT)

    planned_tasks = models.ManyToManyField(Task, related_name="review_periods")

    starts = models.DateTimeField()
    ends = models.DateTimeField()
