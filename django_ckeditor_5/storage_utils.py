from PIL import Image
from django.core.exceptions import ImproperlyConfigured
from django.conf import settings
from django.utils.module_loading import import_string

from django_ckeditor_5.exceptions import NoImageException


def get_django_storage_class():
    storage_setting = getattr(settings, "CKEDITOR_5_FILE_STORAGE", None)
    default_storage_setting = getattr(settings, "DEFAULT_FILE_STORAGE", None)
    storages_setting = getattr(settings, "STORAGES", {})
    default_storage_name = storages_setting.get("default", {}).get("BACKEND")

    if storage_setting:
        return import_string(storage_setting)
    elif default_storage_setting:
        try:
            return import_string(default_storage_setting)
        except ImportError:
            error_msg = f"Invalid default storage class: {default_storage_setting}"
            raise ImproperlyConfigured(error_msg)
    elif default_storage_name:
        try:
            return import_string(default_storage_name)
        except ImportError:
            error_msg = f"Invalid default storage class: {default_storage_name}"
            raise ImproperlyConfigured(error_msg)
    else:
        error_msg = (
            "Either CKEDITOR_5_FILE_STORAGE, DEFAULT_FILE_STORAGE, "
            "or STORAGES['default'] setting is required."
        )
        raise ImproperlyConfigured(error_msg)


def image_verify(f):
    try:
        Image.open(f).verify()
    except OSError:
        raise NoImageException


def handle_uploaded_file(f):
    storage = get_django_storage_class()
    fs = storage()
    filename = fs.save(f.name, f)
    return fs.url(filename)
