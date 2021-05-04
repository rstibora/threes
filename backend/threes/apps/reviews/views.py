from rest_framework import permissions, viewsets

from .models import ReviewPeriod, ReviewPeriodConfiguration
from .serializers import ReviewPeriodConfigurationSerializer, ReviewPeriodSerializer


class ReviewPeriodConfigurationViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewPeriodConfigurationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ReviewPeriodConfiguration.objects.filter(owner=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ReviewPeriodViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewPeriodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = ReviewPeriod.objects.filter(owner=self.request.user.pk)
        configuration_id = self.request.query_params.get("configuration_id")
        if configuration_id:
            queryset = queryset.filter(configuration=configuration_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
