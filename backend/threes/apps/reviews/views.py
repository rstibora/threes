from django.db.models import query
from rest_framework import permissions, viewsets

from .models import Review, ReviewConfiguration, UserReviewConfiguration
from .serializers import (
    ReviewConfigurationSerializer, ReviewSerializer, UserReviewConfigurationSerializer)


class ReviewConfigurationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReviewConfigurationSerializer
    queryset = ReviewConfiguration.objects.all()


class UserReviewConfigurationViewSet(viewsets.ModelViewSet):
    serializer_class = UserReviewConfigurationSerializer

    def get_queryset(self):
        return UserReviewConfiguration.objects.filter(user=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.filter(owner=self.request.user.pk)
        configuration_id = self.request.query_params.get("configuration_id")
        if configuration_id:
            queryset = queryset.filter(configuration=configuration_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
