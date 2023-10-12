import os

from django import get_version
from django.http import Http404
from django.utils.module_loading import import_string

if get_version() >= "4.0":
    from django.utils.translation import gettext_lazy as _
else:
    from django.utils.translation import ugettext_lazy as _

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.http import JsonResponse
from PIL import Image

from .forms import UploadFileForm


class NoImageException(Exception):
    pass


def get_storage_class():
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
            raise ImproperlyConfigured(f"Invalid default storage class: {default_storage_setting}")
    elif default_storage_name:
        try:
            return import_string(default_storage_name)
        except ImportError:
            raise ImproperlyConfigured(f"Invalid default storage class: {default_storage_name}")
    else:
        raise ImproperlyConfigured(
            "Either CKEDITOR_5_FILE_STORAGE, DEFAULT_FILE_STORAGE, or STORAGES['default'] setting is required.")


storage = get_storage_class()


def image_verify(f):
    try:
        Image.open(f).verify()
    except OSError:
        raise NoImageException


def handle_uploaded_file(user, f):
    fs = storage()
    path = f.name
    if getattr(settings, "CKEDITOR_5_PATH_FROM_USERNAME", False):
        path = storage.get_available_name(os.path.join(user.username, f.name))
    filename = fs.save(path, f)
    return fs.url(filename)


def upload_file(request):
    if request.method == "POST" and request.user.is_staff:
        form = UploadFileForm(request.POST, request.FILES)
        allow_all_file_types = getattr(settings, "CKEDITOR_5_ALLOW_ALL_FILE_TYPES", False)

        if not allow_all_file_types:
            try:
                image_verify(request.FILES['upload'])
            except NoImageException as ex:
                return JsonResponse({"error": {"message": f"{ex}"}})
        if form.is_valid():
            url = handle_uploaded_file(request.user, request.FILES["upload"])
            return JsonResponse({"url": url})
    raise Http404(_("Page not found."))
