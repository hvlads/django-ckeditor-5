from django import get_version
from django.http import Http404
from django.utils.module_loading import import_string

if get_version() >= "4.0":
    from django.utils.translation import gettext_lazy as _
else:
    from django.utils.translation import ugettext_lazy as _

import os
import uuid

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.http import JsonResponse
from django.views import View
from PIL import Image

from .forms import UploadFileForm


class NoImageException(Exception):
    pass


class UploadImageView(View):
    def post(self, request, *args, **kwargs):
        if request.user.is_staff or (
            not self.request.user.is_staff
            and getattr(settings, "CKEDITOR_5_UPLOAD_IMAGES_ALLOW_ALL_USERS", None)
        ):
            form = UploadFileForm(request.POST, request.FILES)
            try:
                self.image_verify(request.FILES["upload"])
            except NoImageException as ex:
                return JsonResponse({"error": {"message": f"{ex}"}})
            if form.is_valid():
                url = self.handle_uploaded_file(request.FILES["upload"])
                return JsonResponse({"url": url})
        raise Http404(_("Page not found."))

    def get_storage_class(self):
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

    def image_verify(self, f):
        try:
            Image.open(f).verify()
        except OSError:
            raise NoImageException

    def handle_uploaded_file(self, f):
        fs = self.get_storage_class()()
        filename = f.name.lower()
        if getattr(settings, "CKEDITOR_5_UPLOAD_IMAGES_RENAME_UUID", None) is True:
            filename = f"{uuid.uuid4()}{os.path.splitext(filename)[1]}"
        filesaved = fs.save(filename, f)
        return fs.url(filesaved)
