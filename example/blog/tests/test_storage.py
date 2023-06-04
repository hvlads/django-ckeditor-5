import pytest
from django.core.exceptions import ImproperlyConfigured
from django.test import override_settings
from django.utils.module_loading import import_string

from django_ckeditor_5.views import get_storage_class


@override_settings(
    CKEDITOR_5_FILE_STORAGE="articles.storage.CustomStorage",
    DEFAULT_FILE_STORAGE="django.core.files.storage.FileSystemStorage",
    STORAGES={"default": {"BACKEND": "django.core.files.storage.FileSystemStorage"}},
)
def test_get_storage_class(settings):
    # Case 1: CKEDITOR_5_FILE_STORAGE is defined
    storage_class = get_storage_class()
    assert storage_class == import_string(settings.CKEDITOR_5_FILE_STORAGE)

    # Case 2: DEFAULT_FILE_STORAGE is defined
    delattr(settings, "CKEDITOR_5_FILE_STORAGE")
    storage_class = get_storage_class()
    assert storage_class == import_string(settings.DEFAULT_FILE_STORAGE)

    # Case 3: STORAGES['default'] is defined
    delattr(settings, "DEFAULT_FILE_STORAGE")
    storage_class = get_storage_class()
    assert storage_class == import_string(settings.STORAGES["default"]["BACKEND"])

    # Case 4: None of the required settings is defined
    delattr(settings, "STORAGES")
    with pytest.raises(ImproperlyConfigured):
        get_storage_class()
