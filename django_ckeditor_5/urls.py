from django.urls import path

from . import views

urlpatterns = [
    path("image_upload/", views.upload_file, name="ck_editor_5_upload_file"),
]
