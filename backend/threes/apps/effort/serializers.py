from rest_framework import serializers

from .models import Effort


class EffortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Effort
        fields = ["id", "task", "starts", "duration"]
