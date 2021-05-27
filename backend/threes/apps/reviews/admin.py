from django.contrib import admin

from .forms import ReviewPeriodForm
from .models import ReviewPeriod, ReviewPeriodConfiguration


class ReviewPeriodAdmin(admin.ModelAdmin):
    form = ReviewPeriodForm


admin.site.register(ReviewPeriod, ReviewPeriodAdmin)
admin.site.register(ReviewPeriodConfiguration)
