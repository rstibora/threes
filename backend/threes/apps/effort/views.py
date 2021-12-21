from rest_framework import permissions, viewsets

from .models import Effort, EffortSession, EffortSessionEvent
from .serializers import EffortSerializer, EffortSessionSerializer, EffortSessionEventSerializer


class EffortViewSet(viewsets.ModelViewSet):
    serializer_class = EffortSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Effort.objects.filter(owner=self.request.user.pk).order_by("-starts")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EffortSessionViewSet(viewsets.ModelViewSet):
    serializer_class = EffortSessionSerializer

    def get_queryset(self):
        return EffortSession.objects.filter(owner=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EffortSessionEventViewSet(viewsets.ModelViewSet):
    serializer_class = EffortSessionEventSerializer

    def get_queryset(self):
        return EffortSessionEvent.objects.filter(owner=self.request.user.pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
