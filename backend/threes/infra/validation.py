from abc import ABC, abstractmethod
from itertools import chain
from typing import Any, Optional, Tuple

from django.db import models
from django.core.exceptions import ValidationError

from rest_framework.exceptions import ValidationError as RestFrameworkValidationError


class BaseDuplicateValidator(ABC):
    """
    Duplicate as in Django and Django REST Framework...
    """
    def __init__(self, model):
        self._model = model

    def validate_cleaned_data(self, cleaned_data):
        data = dict()
        for field in self._model._meta.get_fields():
            if field.name in cleaned_data:
                if isinstance(field, models.ForeignKey):
                    data[field.name] = cleaned_data[field.name].id
                elif isinstance(field, models.ManyToManyField):
                    data[field.name] = list(chain(*(map(lambda d: d.values(),
                                                        cleaned_data[field.name].values("id")))))
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
