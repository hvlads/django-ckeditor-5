import re
from pathlib import Path
from threading import Thread

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models.signals import post_delete

from .widgets import CKEditor5Widget


class CKEditor5Field(models.Field):
    def __init__(self, *args, config_name="default", **kwargs):
        self.config_name = config_name
        super().__init__(*args, **kwargs)

    def get_internal_type(self):
        return "TextField"

    def formfield(self, **kwargs):
        return super(CKEditor5Field, self).formfield(
            **{
                "max_length": self.max_length,
                **({"widget": CKEditor5Widget(config_name=self.config_name)}),
                **kwargs,
            }
        )
