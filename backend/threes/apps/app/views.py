from typing import Any, Dict

from django.utils.html import escape
from django.views.generic.base import TemplateView

from infra.version import git_date, git_hash, git_is_clean, git_tag


class AppView(TemplateView):
    template_name = "app/app.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return {
            "git_date": escape(date if (date := git_date()) else ""),
            "git_hash": escape(hash if (hash := git_hash()) else ""),
            "git_is_clean": escape(git_is_clean()),
            "git_tag": escape(tag if (tag := git_tag()) else ""),
        }
