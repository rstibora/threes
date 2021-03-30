from rest_framework import serializers

from .models import EmailUser


class EmailUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EmailUser
        fields = ["email"]
