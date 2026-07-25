import re

from django import forms
from django.conf import settings

from .models import Greeting


NAME_RE = re.compile(r"^[A-Za-zА-Яа-яЁё\-\s'’]+$")

class GreetingForm(forms.Form):
    """Simple form used on the home page."""

    name = forms.CharField(
        label="Your name",
        max_length=50,
        required=True,
        help_text="We store only your name to greet you back.",
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter your name",
                "autocomplete": "given-name",
                "maxlength": "50",
            }
        ),
    )

    def __init__(self, *args, **kwargs):
        """Initialize the form and set up CSS classes for better UX."""
        super().__init__(*args, **kwargs)
        # Visually highlight invalid input (Bootstrap convention).
        if self.is_bound and self.errors.get("name"):
            existing = self.fields["name"].widget.attrs.get("class", "")
            self.fields["name"].widget.attrs["class"] = (existing + " is-invalid").strip()

    def clean_name(self) -> str:
        """Normalize and validate the entered name.

        Validation goals:
        - prevent empty submissions;
        - limit length to reduce abuse surface;
        - allow only a safe set of characters to avoid injection surprises;
        - optionally prevent duplicates (case-insensitive).
        """
        name = (self.cleaned_data.get("name") or "").strip()
        if not name:
            raise forms.ValidationError("Please enter your name.")

        if len(name) < 2:
            raise forms.ValidationError("Name is too short.")

        if not NAME_RE.match(name):
            raise forms.ValidationError(
                "Use only letters, spaces, hyphen or apostrophe (no digits/special symbols)."
            )

        if getattr(settings, "GREETING_PREVENT_DUPLICATES", False):
            if Greeting.objects.filter(name__iexact=name).exists():
                raise forms.ValidationError("This name is already registered.")
        return name


class GreetingModelForm(forms.ModelForm):
    """ModelForm for editing existing records with the same validation rules."""

    class Meta:
        model = Greeting
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "autocomplete": "given-name",
                    "maxlength": "50",
                }
            )
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.is_bound and self.errors.get("name"):
            existing = self.fields["name"].widget.attrs.get("class", "")
            self.fields["name"].widget.attrs["class"] = (existing + " is-invalid").strip()

    def clean_name(self) -> str:
        # Reuse the same rules as in GreetingForm.
        name = (self.cleaned_data.get("name") or "").strip()
        if not name:
            raise forms.ValidationError("Please enter your name.")
        if len(name) < 2:
            raise forms.ValidationError("Name is too short.")
        if not NAME_RE.match(name):
            raise forms.ValidationError(
                "Use only letters, spaces, hyphen or apostrophe (no digits/special symbols)."
            )
        if getattr(settings, "GREETING_PREVENT_DUPLICATES", False):
            qs = Greeting.objects.filter(name__iexact=name)
            if self.instance and self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise forms.ValidationError("This name is already registered.")
        return name
