from django.contrib import admin

from .models import ReviewPeriod, ReviewPeriodConfiguration


admin.site.register((ReviewPeriod, ReviewPeriodConfiguration))
