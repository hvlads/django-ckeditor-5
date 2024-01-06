from django.test import override_settings
from django.urls import reverse


def test_upload_file(admin_client, file):
    with file as upload:
        response = admin_client.post(
            reverse("ck_editor_5_upload_file"),
            {"upload": upload},
        )
    assert response.status_code == 200
    assert "url" in response.json()


@override_settings(
    CKEDITOR_5_FILE_STORAGE="storages.backends.gcloud.GoogleCloudStorage",
    GS_BUCKET_NAME="test",
)
def test_upload_file_to_google_cloud(admin_client, file, settings):
    with file as upload:
        response = admin_client.post(
            reverse("ck_editor_5_upload_file"),
            {"upload": upload},
        )
    assert response.status_code == 200
    assert "url" in response.json()
