import os

from articles.models import Article
from django.conf import settings
from django.urls import reverse

from django_ckeditor_5.signals import extract_image_paths
from django_ckeditor_5.storage_utils import get_storage_class


def test_cleanup_ckeditor_images_on_delete(file, admin_client):
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
    article = Article.objects.create(
        title="test", text=f"<img src='{response.json()['url']}'>"
    )
    images = extract_image_paths(article.text)
    storage = get_storage_class()
    for image in images:
        f_url = os.path.join(storage.location, image)
        file_name = os.path.basename(f_url)
        abs_path = os.path.join(storage.location, file_name)
        assert os.path.exists(abs_path)
    article.delete()
    for image in images:
        f_url = os.path.join(storage.location, image)
        file_name = os.path.basename(f_url)
        abs_path = os.path.join(storage.location, file_name)
        assert not os.path.exists(abs_path)
