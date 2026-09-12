"""DRF serializers.

Keeping API code separate makes it easier to evolve versioned APIs.
"""

from rest_framework import serializers
from django.conf import settings

from .forms import NAME_RE
from .models import Greeting


class GreetingSerializer(serializers.ModelSerializer):
    """Serializer for Greeting model."""

    def validate_name(self, value: str) -> str:
        name = (value or "").strip()
        if len(name) < 2:
            raise serializers.ValidationError("Name is too short.")
        if len(name) > 50:
            raise serializers.ValidationError("Name is too long.")
        if not NAME_RE.match(name):
            raise serializers.ValidationError("Use only letters, spaces, hyphen or apostrophe.")
        if getattr(settings, "GREETING_PREVENT_DUPLICATES", False):
            qs = Greeting.objects.filter(name__iexact=name)
            if self.instance and getattr(self.instance, "pk", None):
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError("This name is already registered.")
        return name

    class Meta:
        model = Greeting
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]
