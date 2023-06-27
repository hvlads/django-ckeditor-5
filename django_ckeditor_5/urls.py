from django.conf.urls import url

from . import views


urlpatterns = [
    url(r"^image_upload/", views.upload_file, name="ck_editor_5_upload_file"),
]
