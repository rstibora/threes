from rest_framework import serializers

from apps.tasks.models import Task

from .models import ReviewPeriod, ReviewPeriodConfiguration
from .validators import OwnedBySameUserValidator


class ReviewPeriodConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPeriodConfiguration
        fields = ["id", "active", "name", "base_duration", "multiplier", "starts", "index_type",
                  "index_reset_duration"]


class ReviewPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPeriod
        fields = ["id", "configuration", "planned_tasks", "index", "review_period_index",
                  "starts", "ends"]
        validators = [
            OwnedBySameUserValidator(Task.objects.all(), "planned_tasks", rest_framework_mode=True)]
