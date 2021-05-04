from rest_framework import serializers

from .models import ReviewPeriod, ReviewPeriodConfiguration


class ReviewPeriodConfigurationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReviewPeriodConfiguration
        fields = ["id", "name", "base_duration", "multiplier", "starts", "index_type",
                  "index_reset_duration"]


class ReviewPeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReviewPeriod
        fields = ["id", "configuration", "planned_tasks", "index", "review_period_index"]
