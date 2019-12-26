import boto3
import urllib.parse
import uuid
import os
from pathlib import Path
from django.http import Http404
from django.utils.translation import ugettext_lazy as _
from django.http import JsonResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from .forms import UploadFileForm
from PIL import Image
from django.conf import settings
from .models import CKEditorImageUpload


class NoImageException(Exception):
    pass


def image_verify(f):
    try:
        Image.open(f).verify()
    except IOError:
        raise NoImageException


def upload_file(request):
    if request.method == 'POST' and request.user.is_staff:
        form = UploadFileForm(request.POST, request.FILES)
        try:
            image_verify(request.FILES['upload'])
        except NoImageException as ex:
            return JsonResponse({
                "error": {
                    "message": "{}".format(str(ex))
                }
            })
        if form.is_valid():
            upload = CKEditorImageUpload(upload=request.FILES['upload'])
            upload.save()
            return JsonResponse({'url': upload.upload.url})
        else:
            return JsonResponse(form.errors, status=400)
    raise Http404(_('Page not found.'))
