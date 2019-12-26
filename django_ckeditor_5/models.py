from django.db import models


class CKEditorImageUpload(models.Model):
    """Django CK Editor Image Upload model."""

    upload = models.ImageField(upload_to='django_ckeditor_5/')
  