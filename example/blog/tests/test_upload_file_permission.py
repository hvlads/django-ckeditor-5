from django.conf import settings

from django_ckeditor_5.views import upload_file


def test_upload_file_permission_anonymous(factory, anonymous_user, file):
    settings.CKEDITOR_5_FILE_UPLOAD_PERMISSION = "authenticated"
    request = factory.post("/upload/", {"upload": file})
    request.user = anonymous_user
    response = upload_file(request)
    assert response.status_code == 403


def test_upload_file_permission_authenticated(factory, authenticated_user, file):
    settings.CKEDITOR_5_FILE_UPLOAD_PERMISSION = "authenticated"
    request = factory.post("/upload/", {"upload": file})
    request.user = authenticated_user
    response = upload_file(request)
    assert response.status_code == 200


def test_upload_file_permission_staff(factory, staff_user, file):
    settings.CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"
    request = factory.post("/upload/", {"upload": file})
    request.user = staff_user
    response = upload_file(request)
    assert response.status_code == 200


def test_upload_file_permission_any(factory, anonymous_user, file):
    settings.CKEDITOR_5_FILE_UPLOAD_PERMISSION = "any"
    request = factory.post("/upload/", {"upload": file})
    request.user = anonymous_user
    response = upload_file(request)
    assert response.status_code == 200


def test_upload_file_permission_authenticated_user(factory, authenticated_user, file):
    settings.CKEDITOR_5_FILE_UPLOAD_PERMISSION = "any"
    request = factory.post("/upload/", {"upload": file})
    request.user = authenticated_user
    response = upload_file(request)
    assert response.status_code == 200
