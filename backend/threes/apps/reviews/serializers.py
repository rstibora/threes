from rest_framework import serializers

from .models import Review, ReviewConfiguration, UserReviewConfiguration
# from .validators import OwnedBySameUserValidator


class ReviewConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewConfiguration
        fields = "__all__"


class UserReviewConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReviewConfiguration
        fields = ["id", "user", "configuration", "is_active"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "configuration", "index", "planned_tasks"]
        validators = []
            # OwnedBySameUserValidator(ReviewPeriod, Task.objects.all(), "planned_tasks"),
            # OwnedBySameUserValidator(ReviewPeriod, ReviewPeriodConfiguration.objects.all(),
                                    #  "configuration")]
