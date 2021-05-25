from typing import Any, Union

from django.db.models import QuerySet
from django.core.exceptions import ValidationError

from rest_framework.exceptions import ValidationError as RestFrameworkValidationError


class BaseDuplicateValidator:
    def __init__(self, *, rest_framework_mode: bool) -> None:
        self._rest_framework_mode = rest_framework_mode

    def _construct_exception(self, message: str,
                             *, code: str) -> Union[ValidationError, RestFrameworkValidationError]:
        if self._rest_framework_mode:
            return RestFrameworkValidationError(message, code)
        return ValidationError(message, code)


class OwnedBySameUserValidator(BaseDuplicateValidator):
    requires_context = False

    def __init__(self, queryset: QuerySet, ids_field_name: str, *, rest_framework_mode: bool):
        super().__init__(rest_framework_mode=rest_framework_mode)
        self._queryset = queryset
        self._ids_field_name = ids_field_name

    def __call__(self, attrs: dict[str, Any]) -> None:
        owner = attrs["owner"]
        if self._queryset.filter(id__in=attrs[self._ids_field_name]).exclude(owner=owner).exists():
            raise self._construct_exception("All objects should be owned by the same user",
                                            code="invalid")
