from django.apps import AppConfig


class DjangoCkeditor5Config(AppConfig):
    name = "django_ckeditor_5"
    verbose_name = "Django CKEditor 5"

    def ready(self):
        from . import signals  # noqa: F401
