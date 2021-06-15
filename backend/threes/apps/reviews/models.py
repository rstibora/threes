from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import Tuple

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
    active = models.BooleanField()

    name = models.CharField(max_length=64)

    base_duration = models.CharField(max_length=1, choices=BASE_DURATION_CHOICES)
    multiplier = models.IntegerField()

    starts = models.DateTimeField()
    index_type = models.CharField(max_length=2, choices=INDEX_CHOICES)
    index_reset_duration = models.CharField(max_length=1, choices=INDEX_RESET_CHOICES)

    def get_dates_for_indices(self, index: int,
                              review_period_index: int) -> Tuple[datetime, datetime]:
        index_delta = index * self.multiplier
        index_delta_plus_one = (index + 1) * self.multiplier
        if self.base_duration == self.DAY:
            starts = self.starts + relativedelta(days=index_delta)
            ends = self.starts + relativedelta(days=index_delta_plus_one)
        elif self.base_duration == self.WEEK:
            starts = self.starts + relativedelta(weeks=index_delta)
            ends = self.starts + relativedelta(weeks=index_delta_plus_one)
        elif self.base_duration == self.MONTH:
            starts = self.starts + relativedelta(months=index_delta)
            ends = self.starts + relativedelta(months=index_delta_plus_one)
        elif self.base_duration == self.YEAR:
            starts = self.starts + relativedelta(years=index_delta)
            ends = self.starts + relativedelta(years=index_delta_plus_one)
        else:
            raise Exception(f"Invalid base duration '{self.base_duration}'")

        if self.index_reset_duration == self.END_OF_YEAR:
            starts = starts + relativedelta(years=review_period_index)
            ends = ends + relativedelta(years=review_period_index)
        return starts, ends

    def __str__(self):
        return f"{self.name} {self.id}"


class ReviewPeriod(models.Model):
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE, related_name="review_periods")
    configuration = models.ForeignKey(ReviewPeriodConfiguration, on_delete=models.CASCADE)

    planned_tasks = models.ManyToManyField(Task, related_name="review_periods", blank=True)

    index = models.IntegerField()
    review_period_index = models.IntegerField()

    @property
    def starts(self) -> str:
        return self.configuration.get_dates_for_indices(
            self.index, self.review_period_index)[0].isoformat()

    @property
    def ends(self) -> str:
        return self.configuration.get_dates_for_indices(
            self.index, self.review_period_index)[1].isoformat()

    def __str__(self):
        return f"{self.id} of {self.configuration} ({self.index=}, {self.review_period_index=})"
