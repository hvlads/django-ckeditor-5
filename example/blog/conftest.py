import os

import pytest
from django.contrib.auth.models import AnonymousUser, User
from django.test import RequestFactory

from django_ckeditor_5.fields import CKEditor5Field
from django_ckeditor_5.forms import UploadFileForm


@pytest.fixture
def file():
    file_path = os.path.join(os.path.dirname(__file__), "fixtures", "files", "test.png")
    return open(file_path, "rb")


@pytest.fixture
def ckeditor5_field():
    return CKEditor5Field()


@pytest.fixture
def upload_file_form():
    return UploadFileForm()


@pytest.fixture
def factory():
    return RequestFactory()


@pytest.fixture
def anonymous_user():
    return AnonymousUser()


@pytest.fixture
def authenticated_user(db):  # noqa: ARG001
    return User.objects.create_user(username="testuser", password="12345")  # noqa: S106


@pytest.fixture
def staff_user(db):  # noqa: ARG001
    return User.objects.create_user(
        username="staffuser",
        password="12345",  # noqa: S106
        is_staff=True,
    )
