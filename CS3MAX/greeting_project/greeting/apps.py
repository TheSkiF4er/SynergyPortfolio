"""App configuration for the greeting app."""

from django.apps import AppConfig


class GreetingConfig(AppConfig):
    """Django AppConfig.

    We keep the app label as `greeting` so existing migrations and URLs remain stable,
    while the import path lives under `greeting_project.greeting`.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "greeting_project.greeting"
    label = "greeting"
