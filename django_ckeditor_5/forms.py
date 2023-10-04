from django import forms
from django.conf import settings
from django.core.validators import FileExtensionValidator


class UploadFileForm(forms.Form):
    upload = forms.FileField(
        validators=[
            FileExtensionValidator(
                getattr(
                    settings,
                    "CKEDITOR_5_UPLOAD_FILE_TYPES",
                    ["jpeg", "png", "gif", "bmp", "webp", "tiff"],
                ),
            ),
        ],
    )
