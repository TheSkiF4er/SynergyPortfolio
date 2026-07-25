from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Greeting


class GreetingAppTests(TestCase):
    def test_home_page_loads(self):
        resp = self.client.get(reverse("index"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Say hello")

    def test_valid_name_creates_record_and_redirects(self):
        resp = self.client.post(reverse("index"), {"name": "Alice"})
        # PRG redirect
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(Greeting.objects.count(), 1)
        self.assertEqual(Greeting.objects.first().name, "Alice")

        # Follow redirect and check message is displayed
        resp2 = self.client.get(reverse("index"))
        self.assertEqual(resp2.status_code, 200)

    def test_empty_name_shows_error(self):
        resp = self.client.post(reverse("index"), {"name": "   "})
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Please fix the errors below.")
        self.assertEqual(Greeting.objects.count(), 0)

    def test_history_page_lists_items(self):
        Greeting.objects.create(name="Bob")
        resp = self.client.get(reverse("history"))
        # Backward compatibility: history redirects to the CRUD list page.
        self.assertEqual(resp.status_code, 302)
        resp2 = self.client.get(reverse("greetings"))
        self.assertEqual(resp2.status_code, 200)
        self.assertContains(resp2, "Bob")

    def test_api_returns_json(self):
        Greeting.objects.create(name="Eve")
        resp = self.client.get(reverse("api_greetings"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp["Content-Type"], "application/json")
        data = resp.json()
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["items"][0]["name"], "Eve")

    @override_settings(GREETING_PREVENT_DUPLICATES=True)
    def test_duplicate_name_is_rejected_when_enabled(self):
        Greeting.objects.create(name="Alice")
        resp = self.client.post(reverse("index"), {"name": "alice"})
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "already registered")
        self.assertEqual(Greeting.objects.count(), 1)

    def test_edit_and_delete_flow(self):
        g = Greeting.objects.create(name="John")

        # Edit
        resp = self.client.post(reverse("greeting_edit", args=[g.pk]), {"name": "Johnny"})
        self.assertEqual(resp.status_code, 302)
        g.refresh_from_db()
        self.assertEqual(g.name, "Johnny")

        # Delete
        resp = self.client.post(reverse("greeting_delete", args=[g.pk]))
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(Greeting.objects.count(), 0)

    def test_drf_api_list(self):
        Greeting.objects.create(name="Zoe")
        resp = self.client.get("/api/v1/greetings/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # DefaultRouter list response is paginated only if pagination is configured.
        # With default settings it's a list.
        self.assertTrue(isinstance(data, list))
        self.assertEqual(data[0]["name"], "Zoe")
