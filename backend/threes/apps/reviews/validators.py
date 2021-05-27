from abc import ABC, abstractmethod
from typing import Any, Optional, Tuple


from django.db import models
from django.core.exceptions import ValidationError

from rest_framework.exceptions import ValidationError as RestFrameworkValidationError


class BaseDuplicateValidator(ABC):
    def __init__(self, model):
        self._model = model

    def validate_cleaned_data(self, cleaned_data):
        data = dict()
        for field in self._model._meta.get_fields():
            if field.name in cleaned_data:
                if isinstance(field, models.ForeignKey):
                    data[field.name] = cleaned_data[field.name].id
                elif isinstance(field, models.ManyToManyField):
                    data[field.name] = cleaned_data[field.name].values("id")
                else:
                    data[field.name] = cleaned_data[field.name]
        if (message_and_code := self._validate(data)):
            raise ValidationError(*message_and_code)

    def __call__(self, attrs: dict[str, Any]) -> None:
        if (message_and_code := self._validate(attrs)):
            raise RestFrameworkValidationError(*message_and_code)

    @abstractmethod
    def _validate(self, attrs: dict[str, Any]) -> Optional[Tuple[str, str]]:
        """
        Validate based on REST api attrs.
        """


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
        if self._queryset.filter(id__in=attrs[self._ids_field_name]).exclude(owner=owner).exists():
            return "All objects should be owned by the same user", "invalid"
