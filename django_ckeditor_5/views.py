from pathlib import Path
import urllib.parse
from django.http import Http404
from django.utils.translation import ugettext_lazy as _
from django.http import JsonResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from .forms import UploadFileForm
from PIL import Image


class NoImageException(Exception):
    pass


def image_verify(f):
    try:
        Image.open(f).verify()
    except IOError:
        raise NoImageException


def handle_uploaded_file(f):
    folder = getattr(settings, 'CKEDITOR_5_UPLOADS_FOLDER', 'django_ckeditor_5')
    uploads_path = Path(settings.MEDIA_ROOT, folder)
    fs = FileSystemStorage(location=uploads_path)
    filename = fs.save(f.name, f)
    return '/'.join([urllib.parse.urljoin(fs.base_url, folder), filename])


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
            url = handle_uploaded_file(request.FILES['upload'])
            return JsonResponse({'url': url})
    raise Http404(_('Page not found.'))
