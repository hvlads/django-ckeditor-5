import pytest
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils.module_loading import import_string

from django_ckeditor_5.views import get_storage_class


def test_get_storage_class():
    # Case 1: CKEDITOR_5_FILE_STORAGE is defined
    storage_setting = "articles.storage.CustomStorage"
    settings.CKEDITOR_5_FILE_STORAGE = storage_setting
    storage_class = get_storage_class()
    assert storage_class == import_string(storage_setting)

    # Case 2: DEFAULT_FILE_STORAGE is defined
    default_storage_setting = "django.core.files.storage.FileSystemStorage"
    settings.CKEDITOR_5_FILE_STORAGE = None
    settings.DEFAULT_FILE_STORAGE = default_storage_setting
    storage_class = get_storage_class()
    assert storage_class == import_string(default_storage_setting)

    # Case 3: STORAGES['default'] is defined
    default_storage_name = "django.core.files.storage.FileSystemStorage"
    settings.DEFAULT_FILE_STORAGE = None
    settings.STORAGES = {"default": {"BACKEND": default_storage_name}}
    storage_class = get_storage_class()
    assert storage_class == import_string(default_storage_name)

    # Case 4: None of the required settings is defined
    settings.STORAGES = {}
    with pytest.raises(ImproperlyConfigured):
        get_storage_class()

    # Clean up the settings
    delattr(settings, "CKEDITOR_5_FILE_STORAGE")
    delattr(settings, "DEFAULT_FILE_STORAGE")
    delattr(settings, "STORAGES")
