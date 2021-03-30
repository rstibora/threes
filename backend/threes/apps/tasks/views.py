from django.views import generic

from rest_framework import permissions, viewsets

from .models import Task
from .serializers import TaskSerializer


class IndexView(generic.ListView):
    template_name = "tasks/task_list.html"
    context_object_name = "tasks"

    def get_queryset(self):
        return Task.objects.all()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    # TODO: change to authenticated only.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
