"""REST API (DRF).

The project keeps the original lightweight JSON endpoint for simplicity,
while also providing a DRF-based API for integrations.
"""

from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Greeting
from .serializers import GreetingSerializer


class GreetingViewSet(viewsets.ModelViewSet):
    """CRUD API for greetings.

    For a real production service you would typically add:
    - authentication & permissions
    - pagination limits
    - rate limiting
    - audit logging
    """

    queryset = Greeting.objects.all()
    serializer_class = GreetingSerializer
    permission_classes = [AllowAny]
