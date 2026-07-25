from __future__ import annotations

from django.contrib import messages
from django.core.cache import cache
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.generic import DeleteView, ListView, UpdateView

from .forms import GreetingForm, GreetingModelForm
from .models import Greeting


def _time_based_greeting(dt) -> str:
    """Return a friendly greeting based on local time of day."""
    hour = dt.hour
    if 5 <= hour < 12:
        return "Good morning"
    if 12 <= hour < 18:
        return "Good afternoon"
    if 18 <= hour < 23:
        return "Good evening"
    return "Hello"


@require_http_methods(["GET", "POST"])
def index(request: HttpRequest) -> HttpResponse:
    """Home page: shows the form and greets the user.

    Uses the PRG pattern (Post/Redirect/Get) to prevent accidental resubmits
    on page refresh and to show feedback via Django messages.
    """
    if request.method == "POST":
        form = GreetingForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            Greeting.objects.create(name=name)
            cache.delete("last_greetings")
            # Invalidate the most common API cache key.
            cache.delete("api_greetings:20")
            greeting = _time_based_greeting(timezone.localtime())
            messages.success(request, f"{greeting}, {name}! Your name was saved successfully.")
            return redirect("index")
        messages.error(request, "Please fix the errors below.")
    else:
        form = GreetingForm()

    # Cache small widgets if the page gets heavier over time.
    last_greetings = cache.get("last_greetings")
    if last_greetings is None:
        last_greetings = list(Greeting.objects.all()[:5])
        cache.set("last_greetings", last_greetings, timeout=30)
    return render(
        request,
        "greeting/index.html",
        {
            "form": form,
            "last_greetings": last_greetings,
        },
    )


@require_http_methods(["GET"])
def history(request: HttpRequest) -> HttpResponse:
    """Redirect to the CRUD list view (kept for backward compatibility)."""
    return redirect("greetings")


class GreetingListView(ListView):
    """List the latest greetings (with edit/delete actions)."""

    model = Greeting
    template_name = "greeting/greetings_list.html"
    context_object_name = "greetings"
    paginate_by = 50


class GreetingUpdateView(UpdateView):
    """Edit an existing greeting entry."""

    model = Greeting
    form_class = GreetingModelForm
    template_name = "greeting/greetings_edit.html"
    success_url = reverse_lazy("greetings")

    def form_valid(self, form):
        messages.success(self.request, "Name updated successfully.")
        cache.delete("last_greetings")
        cache.delete("api_greetings:20")
        return super().form_valid(form)


class GreetingDeleteView(DeleteView):
    """Delete an existing greeting entry."""

    model = Greeting
    template_name = "greeting/greetings_delete.html"
    success_url = reverse_lazy("greetings")

    def delete(self, request, *args, **kwargs):
        messages.success(request, "Name deleted successfully.")
        cache.delete("last_greetings")
        cache.delete("api_greetings:20")
        return super().delete(request, *args, **kwargs)


@require_http_methods(["GET"])
def api_greetings(request: HttpRequest) -> JsonResponse:
    """A tiny JSON API endpoint.

    Intended as a starting point for future extension (auth, pagination, etc.).
    """
    limit = min(int(request.GET.get("limit", "20")), 100)

    cache_key = f"api_greetings:{limit}"
    cached = cache.get(cache_key)
    if cached is not None:
        return JsonResponse(cached)

    qs = Greeting.objects.all().only("name", "created_at")[:limit]
    items = [{"name": g.name, "created_at": g.created_at.isoformat()} for g in qs]
    payload = {"count": len(items), "items": items}
    cache.set(cache_key, payload, timeout=60)
    return JsonResponse(payload)
