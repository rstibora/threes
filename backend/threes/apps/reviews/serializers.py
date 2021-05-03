from rest_framework import serializers

from .models import ReviewPeriodConfiguration


class ReviewPeriodConfigurationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReviewPeriodConfiguration
        fields = ["name", "base_duration", "multiplier", "starts", "index_type",
                  "index_reset_duration"]
