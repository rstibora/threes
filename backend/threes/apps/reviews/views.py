from rest_framework import permissions, viewsets

from .models import ReviewPeriodConfiguration
from .serializers import ReviewPeriodConfigurationSerializer


class ReviewPeriodConfigurationViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewPeriodConfigurationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ReviewPeriodConfiguration.objects.filter(owner=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
