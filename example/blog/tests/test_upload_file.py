import os

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse


def test_upload_file(admin_client, file):
    with file as upload:
        upload_view_name = getattr(
            settings,
            "CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME",
            "ck_editor_5_upload_file",
        )
        response = admin_client.post(
            reverse(upload_view_name),
            {"upload": upload},
        )
    assert response.status_code == 200
    assert "url" in response.json()


def test_upload_file_too_big(admin_client):
    file = SimpleUploadedFile("test_image_big.jpeg", bytearray(os.urandom(62915)))
    upload_view_name = getattr(
        settings,
        "CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME",
        "ck_editor_5_upload_file",
    )
    response = admin_client.post(
        reverse(upload_view_name),
        {"upload": file},
    )
    assert response.status_code == 400
    response_data = response.json()
    assert "error" in response_data
    error = response_data["error"]
    assert "message" in error
    assert error["message"] == "File should be at most 0.06 MB."


def test_upload_file_forbbiden_file_typ(admin_client):
    file = SimpleUploadedFile("test_pdf.pdf", b"random data")
    upload_view_name = getattr(
        settings,
        "CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME",
        "ck_editor_5_upload_file",
    )
    response = admin_client.post(
        reverse(upload_view_name),
        {"upload": file},
    )
    assert response.status_code == 400
    response_data = response.json()
    assert "error" in response_data
    error = response_data["error"]
    assert "message" in error
    assert error["message"] == (
        "File extension “pdf” is not allowed. Allowed extensions are: jpg, jpeg, png, gif, "
        "bmp, webp, tiff."
    )
