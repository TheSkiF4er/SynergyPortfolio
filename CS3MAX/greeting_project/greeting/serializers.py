"""DRF serializers.

Keeping API code separate makes it easier to evolve versioned APIs.
"""

from rest_framework import serializers

from .models import Greeting


class GreetingSerializer(serializers.ModelSerializer):
    """Serializer for Greeting model."""

    class Meta:
        model = Greeting
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]
