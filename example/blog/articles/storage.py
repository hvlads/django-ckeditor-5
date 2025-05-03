import os
from urllib.parse import urljoin

from django.conf import settings
from django.core.files.storage import FileSystemStorage


class CustomStorage(FileSystemStorage):
    """Custom storage for django_ckeditor_5 images."""

    def __init__(self, *args, **kwargs):
        location = kwargs.pop(
            "location", os.path.join(settings.MEDIA_ROOT, "django_ckeditor_5")
        )
        base_url = kwargs.pop(
            "base_url", urljoin(settings.MEDIA_URL, "django_ckeditor_5/")
        )
        super().__init__(location=location, base_url=base_url, *args, **kwargs)
