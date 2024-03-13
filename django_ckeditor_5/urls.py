from django.urls import path

from .views import UploadImageView

urlpatterns = [
    path("image_upload/", UploadImageView.as_view(), name="ck_editor_5_upload_image"),
]
