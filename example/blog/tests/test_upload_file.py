from django.urls import reverse


def test_upload_file(admin_client, file):
    with file as upload:
        response = admin_client.post(
            reverse("ck_editor_5_upload_file"),
            {"upload": upload},
        )
    assert response.status_code == 200
    assert "url" in response.json()
