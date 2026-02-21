from django.core.files.storage import FileSystemStorage, DefaultStorage
from django.test import override_settings

from articles.storage import CustomStorage
from django_ckeditor_5.storage_utils import get_django_storage


@override_settings(
    CKEDITOR_5_FILE_STORAGE="articles.storage.CustomStorage",
)
def test_get_storage_custom(settings):
    # CKEDITOR_5_FILE_STORAGE is defined
    storage = get_django_storage()
    assert isinstance(storage, CustomStorage)


@override_settings(
    CKEDITOR_5_FILE_STORAGE="",
    STORAGES={
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
            "OPTIONS": {
                "location": "custom_location",
            },
        }
    },
)
def test_storage_default_options():
    # Use the default storage with options as defined django
    storage = get_django_storage()
    assert isinstance(storage, FileSystemStorage)
    assert storage.base_location == "custom_location"


@override_settings()
def test_storage_default_not_specified(settings):
    # Use the default storage that django sets when nothing is configured
    del settings.STORAGES
    storage = get_django_storage()
    assert isinstance(storage, DefaultStorage)
