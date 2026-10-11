"""Django settings for the demo Greeting project.

This project is intentionally small and educational.

Improvements added:
- secrets via environment variables (+ optional .env for local dev);
- optional duplicate protection for names;
- optional switch to PostgreSQL/MySQL via DATABASE_URL;
- basic caching settings (ready for Redis when needed);
- production security toggles when DEBUG=False.

For a real production deployment, see README.md.
"""

from pathlib import Path
import os

import dj_database_url
from dotenv import load_dotenv

# Load environment variables from .env (local dev convenience).
# In production you should provide env vars via your process manager / container.
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# In production, provide SECRET_KEY via an environment variable.
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-change-me")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"

# In production, set a comma-separated list in DJANGO_ALLOWED_HOSTS
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if h.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "greeting_project.greeting.apps.GreetingConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "greeting_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "greeting_project.wsgi.application"

DATABASES = {
    "default": dj_database_url.config(
        # Example for PostgreSQL:
        #   DATABASE_URL=postgres://user:pass@localhost:5432/dbname
        # Example for MySQL:
        #   DATABASE_URL=mysql://user:pass@localhost:3306/dbname
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=int(os.environ.get("DJANGO_DB_CONN_MAX_AGE", "0")),
    )
}

# Name duplication check toggle.
# If enabled, the app will reject saving the same name twice (case-insensitive).
GREETING_PREVENT_DUPLICATES = os.environ.get("GREETING_PREVENT_DUPLICATES", "1") == "1"

# Password validation is not needed for this demo (no auth flows).
AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = os.environ.get("DJANGO_TIME_ZONE", "UTC")

USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# WhiteNoise: serve static files in production without additional services.
# In DEBUG/testing we keep the default storage to avoid requiring collectstatic.
if not DEBUG:
    STORAGES = {
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        }
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Security toggles for production (enabled only when DEBUG=False)
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # Modern browsers deprecated X-XSS-Protection, but keeping it doesn't hurt.
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = "DENY"
    SECURE_REFERRER_POLICY = "same-origin"
    SECURE_HSTS_SECONDS = int(os.environ.get("DJANGO_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

# Cache configuration
# - dev default: in-memory cache
# - production recommendation: Redis (e.g., via django-redis)
CACHES = {
    "default": {
        "BACKEND": os.environ.get(
            "DJANGO_CACHE_BACKEND", "django.core.cache.backends.locmem.LocMemCache"
        ),
        "LOCATION": os.environ.get("DJANGO_CACHE_LOCATION", "greeting-cache"),
        "TIMEOUT": int(os.environ.get("DJANGO_CACHE_TIMEOUT", "60")),
    }
}

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}
