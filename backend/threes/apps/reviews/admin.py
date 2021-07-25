from django.contrib import admin

from .models import Review, ReviewConfiguration, UserReviewConfiguration

admin.site.register((Review, ReviewConfiguration, UserReviewConfiguration))
