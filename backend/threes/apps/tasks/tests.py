from django.test import TestCase
from django.urls import reverse

from .models import Task


class TaskModelTests(TestCase):
    def test_task(self):
        task = Task(name="Task Name")
        self.assertEqual(task.name, "Task Name")


class TaskViewTests(TestCase):
    def test_tasks_view(self):
        response = self.client.get(reverse("index"))
        self.assertEqual(response.status_code, 200)
        self.assertQuerysetEqual(response.context["tasks"], [])
