from django.views import generic

from .models import Task


class IndexView(generic.ListView):
    template_name = "tasks/task_list.html"
    context_object_name = "tasks"

    def get_queryset(self):
        return Task.objects.all()
