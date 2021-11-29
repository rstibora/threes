from typing import Any, Dict

from django.utils.html import escape
from django.views.generic.base import TemplateView

from infra.version import git_date, git_hash, git_is_clean, git_tag


class AppView(TemplateView):
    template_name = "app/app.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return {
            "git_date": escape(git_date()),
            "git_hash": escape(git_hash()),
            "git_is_clean": escape(git_is_clean()),
            "git_tag": escape(git_tag()),
        }
