from django.http import Http404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskSerializer


class TaskList(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetail(APIView):
    def get(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            raise Http404
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
