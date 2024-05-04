from django.conf import settings
from django.urls import reverse


def test_upload_file(admin_client, file):
    with file as upload:
        upload_view_name = getattr(settings, "CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME", "")
        response = admin_client.post(
            reverse(upload_view_name),
            {"upload": upload},
        )
    assert response.status_code == 200
    assert "url" in response.json()
