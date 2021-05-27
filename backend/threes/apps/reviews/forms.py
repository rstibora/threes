from django import forms

from apps.tasks.models import Task

from .models import ReviewPeriod, ReviewPeriodConfiguration
from .validators import OwnedBySameUserValidator


class ReviewPeriodForm(forms.ModelForm):
    model = ReviewPeriod
    fields = ["owner", "configuration", "planned_tasks", "index", "review_period_index"]

    def clean(self) -> None:
        super().clean()
        validators = (
            OwnedBySameUserValidator(ReviewPeriod, Task.objects.all(), "planned_tasks"),
            OwnedBySameUserValidator(ReviewPeriod, ReviewPeriodConfiguration.objects.all(),
                                     "configuration"))
        for validator in validators:
            validator.validate_cleaned_data(self.cleaned_data)
