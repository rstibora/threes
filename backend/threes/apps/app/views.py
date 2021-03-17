from django.views.generic.base import TemplateView


class AppView(TemplateView):
    template_name = "app/app.html"
