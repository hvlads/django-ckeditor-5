import os

import pytest

from django_ckeditor_5.fields import CKEditor5Field
from django_ckeditor_5.forms import UploadFileForm


@pytest.fixture()
def file():
    file_path = os.path.join(os.path.dirname(__file__), "fixtures", "files", "test.png")
    return open(file_path, "rb")


@pytest.fixture()
def ckeditor5_field():
    return CKEditor5Field()


@pytest.fixture()
def upload_file_form():
    return UploadFileForm()
