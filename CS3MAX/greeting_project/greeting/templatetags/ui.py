"""Reusable template tags/filters.

These helpers keep templates small and encourage component reuse.
"""

from django import template
from django.utils import timezone

register = template.Library()


@register.filter
def local_dt(value, fmt: str = "%Y-%m-%d %H:%M") -> str:
    """Format a datetime in the current timezone.

    Args:
        value: A timezone-aware datetime.
        fmt: strftime-compatible format.

    Returns:
        Formatted string (or an empty string if value is falsy).
    """
    if not value:
        return ""
    return timezone.localtime(value).strftime(fmt)
