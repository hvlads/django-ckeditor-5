import re
from pathlib import Path
from threading import Thread

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models.signals import post_delete

from .widgets import CKEditor5Widget


def delete_images(instance):
    for field in instance._meta.get_fields():
        if type(field).__name__ == 'CKEditor5Field':
            text = getattr(instance, field.attname)
            for url in re.findall('src="([^"]+)"', text):
                fs = FileSystemStorage()
                folder = getattr(settings, 'CKEDITOR_5_UPLOADS_FOLDER', 'django_ckeditor_5')
                uploads_path = Path(settings.MEDIA_ROOT, folder, url.split('/')[-1])
                if fs.exists(uploads_path):
                    fs.delete(uploads_path)


class CKEditor5Field(models.Field):

    def __init__(self, *args, config_name='default', **kwargs):
        self.config_name = config_name
        super().__init__(*args, **kwargs)

    def get_internal_type(self):
        if hasattr(self, 'model'):
            post_delete.connect(CKEditor5Field.clean_images, sender=self.model)
        return "TextField"

    def formfield(self, **kwargs):
        return super(CKEditor5Field, self).formfield(**{
            'max_length': self.max_length,
            **({'widget': CKEditor5Widget(config_name=self.config_name)}),
            **kwargs,
        })

    @staticmethod
    def clean_images(sender, instance, **kwargs):
        Thread(target=delete_images, args=(instance, )).start()
