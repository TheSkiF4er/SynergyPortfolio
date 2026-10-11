from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

from .api import GreetingViewSet

router = DefaultRouter()
router.register(r"v1/greetings", GreetingViewSet, basename="greeting")

urlpatterns = [
    path("", views.index, name="index"),
    path("history/", views.history, name="history"),
    path("greetings/", views.GreetingListView.as_view(), name="greetings"),
    path("greetings/<int:pk>/edit/", views.GreetingUpdateView.as_view(), name="greeting_edit"),
    path("greetings/<int:pk>/delete/", views.GreetingDeleteView.as_view(), name="greeting_delete"),
    path("api/greetings/", views.api_greetings, name="api_greetings"),
    path("api/", include(router.urls)),
]
