from django.core.exceptions import ValidationError
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
    FORTNIGHT_NUM = "FN"
    MONTH_NAME = "MN"
    QUARTER_NUM = "QN"
    YEAR_NUM = "YN"
    INT = "IN"
    INDEX_CHOICES = [
        (WEEK_NUM, "Week Number"),
        (FORTNIGHT_NUM, "Fortnight Number"),
        (MONTH_NAME, "Month Name"),
        (QUARTER_NUM, "Quarter Number"),
        (YEAR_NUM, "Year Number"),
        (INT, "Integer Index")]

    END_OF_YEAR = "Y"
    NEVER = "N"
    INDEX_RESET_CHOICES = [
        (END_OF_YEAR, "End of Year"),
        (NEVER, "Never")]

    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE,
                              related_name="review_period_configurations")

    name = models.CharField(max_length=64)

    base_duration = models.CharField(max_length=1, choices=BASE_DURATION_CHOICES)
    multiplier = models.IntegerField()

    starts = models.DateTimeField()
    index_type = models.CharField(max_length=2, choices=INDEX_CHOICES)
    index_reset_duration = models.CharField(max_length=1, choices=INDEX_RESET_CHOICES)

    def __str__(self):
        return f"{self.name} {self.id}"


class ReviewPeriod(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="review_periods")
    configuration = models.ForeignKey(ReviewPeriodConfiguration, on_delete=models.CASCADE)

    planned_tasks = models.ManyToManyField(Task, related_name="review_periods")

    index = models.IntegerField()
    review_period_index = models.IntegerField()

    def clean(self) -> None:
        if len(self.planned_tasks.all().filter(owner=models.F("owner"))):
            raise ValidationError("Planned task not owned by review period owner", code="invalid")

    def __str__(self):
        return f"{self.id} of {self.configuration} ({self.index=}, {self.review_period_index=})"
