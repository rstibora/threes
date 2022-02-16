from rest_framework import serializers

from .models import Effort, EffortSession


class EffortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Effort
        fields = ["id", "task", "starts", "duration", "description"]


class EffortSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EffortSession
        fields = ["id", "task", "state", "last_active", "duration", "created", "description"]
