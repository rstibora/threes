from typing import Any, Dict

import os

from django.utils.html import escape
from django.views.generic.base import TemplateView


class AppView(TemplateView):
    template_name = "app/app.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return {
            "git_hash": escape(os.environ.get("GIT_HASH")),
            "git_tag": escape(os.environ.get("GIT_TAG")),
        }
