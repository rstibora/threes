from rest_framework import permissions, viewsets

from .models import Effort
from .serializers import EffortSerializer


class EffortViewSet(viewsets.ModelViewSet):
    serializer_class = EffortSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Effort.objects.filter(owner=self.request.user.pk).order_by("-starts")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
