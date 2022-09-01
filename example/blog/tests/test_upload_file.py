from django.urls import reverse


def test_upload_file(admin_client, file):
    with file as upload:
        response = admin_client.post(
            reverse("ck_editor_5_upload_file"), {"upload": upload}
        )
    assert response.status_code == 200
    assert "url" in response.json()


def test_upload_file_to_google_cloud(admin_client, file, settings, mocker):
    m = mocker.patch("storages.backends.gcloud.Client")
    m.return_value.bucket.return_value.blob.return_value.generate_signed_url.return_value = (
        "new_url"
    )
    settings.CKEDITOR_5_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    settings.GS_BUCKET_NAME = "test"
    with file as upload:
        response = admin_client.post(
            reverse("ck_editor_5_upload_file"), {"upload": upload}
        )
    assert response.status_code == 200
    assert "url" in response.json()
    assert response.json()["url"] == "new_url"
