
from django.db import models

from apps.core.models import EmailUser
from apps.tasks.models import Task


class ReviewConfiguration(models.Model):
    """
    List of possible review configurations: weekly, monthly, ...
    Should be 'read only'.
    """
    name = models.CharField(max_length=32)

    def __str__(self) -> str:
        return f"{self.name}"


class UserReviewConfiguration(models.Model):
    """
    Per-user review configuration.
    """
    user = models.ForeignKey(EmailUser, on_delete=models.CASCADE)
    configuration = models.ForeignKey(ReviewConfiguration, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ["user", "configuration"]

    def __str__(self) -> str:
        return f"{self.user}, {self.configuration}, {self.is_active=}"


class Review(models.Model):
    """
    Model for the individual reviews (e.g. week 15 of the year 2020).
    Indexing starts from the beginning of the UNIX epoch.
    """
    owner = models.ForeignKey(EmailUser, on_delete=models.CASCADE)
    configuration = models.ForeignKey(ReviewConfiguration, on_delete=models.CASCADE)
    index = models.IntegerField()

    planned_tasks = models.ManyToManyField(Task, related_name="review_periods", blank=True)

    class Meta:
        unique_together = ["owner", "configuration", "index"]

    def __str__(self) -> str:
        return f"{self.owner}, {self.configuration}, {self.index}, {self.planned_tasks=}"
