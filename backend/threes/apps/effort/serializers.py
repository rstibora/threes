from rest_framework import serializers

from .models import Effort, EffortSession, EffortSessionEvent


class EffortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Effort
        fields = ["id", "task", "starts", "duration", "description"]


class EffortSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EffortSession


class EffortSessionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EffortSessionEvent
