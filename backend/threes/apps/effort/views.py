from rest_framework import mixins, permissions, viewsets

from .models import Effort, EffortSession
from .serializers import EffortSerializer, EffortSessionSerializer


class EffortViewSet(viewsets.ModelViewSet):
    serializer_class = EffortSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Effort.objects.filter(owner=self.request.user.pk).order_by("-starts")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EffortSessionViewSet(mixins.CreateModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           viewsets.GenericViewSet):
    serializer_class = EffortSessionSerializer
    lookup_field = "owner"

    def get_queryset(self):
        return EffortSession.objects.filter(owner=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
