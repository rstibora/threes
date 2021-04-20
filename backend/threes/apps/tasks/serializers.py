from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Task
        fields = ["owner", "name", "description", "created"]
