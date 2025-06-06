# analytics/models.py
from django.db import (
    models,
)
from django.utils.timezone import (
    now,
)


class PageView(models.Model):
    url = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(
        blank=True,
        null=True,
    )
    timestamp = models.DateTimeField(default=now)

    def __str__(
        self,
    ):
        return f"{self.url} - {self.timestamp}"


class DailyPageViewCount(models.Model):
    url = models.CharField(max_length=255)
    date = models.DateField()
    count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = (
            "url",
            "date",
        )

    def __str__(
        self,
    ):
        return f"{self.url} - {self.date}: {self.count} views"


class UniqueVisitor(models.Model):
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(
        blank=True,
        null=True,
    )
    first_visit = models.DateTimeField(default=now)
    last_visit = models.DateTimeField(default=now)
    visit_count = models.PositiveIntegerField(default=1)
    is_bot = models.BooleanField(default=False)

    def save(
        self,
        *args,
        **kwargs,
    ):
        if "bot" in self.user_agent.lower():
            self.is_bot = True
        super().save(
            *args,
            **kwargs,
        )

    class Meta:
        unique_together = (
            "ip_address",
            "user_agent",
        )

    def most_common_url(
        self,
    ):
        page_view = (
            PageView.objects.filter(ip_address=self.ip_address)
            .order_by("-timestamp")
            .first()
        )
        return page_view.url if page_view else ""

    def __str__(
        self,
    ):
        return f"{self.ip_address} - Visits: {self.visit_count}"
