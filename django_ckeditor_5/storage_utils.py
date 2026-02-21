from PIL import Image
from django.core.files.storage import default_storage
from django.conf import settings
from django.utils.module_loading import import_string

from django_ckeditor_5.exceptions import NoImageException


def get_django_storage():
    storage_setting = getattr(settings, "CKEDITOR_5_FILE_STORAGE", None)
    if storage_setting:
        return import_string(storage_setting)()

    storages = getattr(settings, "STORAGES", {})
    default_config = storages.get("default", {})
    if default_config.get("OPTIONS"):
        backend = default_config["BACKEND"]
        return import_string(backend)(**default_config["OPTIONS"])

    return default_storage


def image_verify(f):
    try:
        Image.open(f).verify()
    except OSError:
        raise NoImageException


def handle_uploaded_file(f):
    fs = get_django_storage()
    filename = fs.save(f.name, f)
    return fs.url(filename)
