from typing import Any, Iterable, Optional, Tuple

from django.db import models

from infra.validation import BaseDuplicateValidator


class OwnedBySameUserValidator(BaseDuplicateValidator):
    """
    Validates that all the related models to this instance have the same owner as the instance.
    """
    requires_context = False

    def __init__(self, model, queryset: models.QuerySet, ids_field_name: str) -> None:
        super().__init__(model)
        self._queryset = queryset
        self._ids_field_name = ids_field_name

    def _validate(self, attrs: dict[str, Any]) -> Optional[Tuple[str, str]]:
        owner = attrs["owner"]
        filtered = (self._queryset.filter(id__in=attrs[self._ids_field_name])
                    if isinstance(attrs[self._ids_field_name], Iterable)
                    else self._queryset.filter(id=attrs[self._ids_field_name]))
        if filtered.exclude(owner=owner).exists():
            return "All objects should be owned by the same user", "invalid"
