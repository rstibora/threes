from datetime import datetime
from typing import Any, Optional

from django.core.management.base import BaseCommand, CommandError

from apps.core.models import EmailUser
from apps.reviews.models import ReviewPeriod, ReviewPeriodConfiguration


class Command(BaseCommand):
    help = "Generates future review period records"

    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        users = EmailUser.objects.all()
        for user in users:
            configurations = ReviewPeriodConfiguration.objects.filter(owner=user)
            for configuration in configurations:
                last_review = ReviewPeriod.objects.filter(configuration=configuration).order_by(
                    "-review_period_index", "-index").last()
                if not last_review:
                    continue
                
                if 

