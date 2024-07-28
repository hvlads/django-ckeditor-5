from django import get_version
from django.conf import settings
from django.http import JsonResponse

if get_version() >= "4.0":
    from django.utils.translation import gettext_lazy as _
else:
    from django.utils.translation import ugettext_lazy as _


def check_upload_permission(view_func):
    def _wrapped_view(request, *args, **kwargs):
        permission = getattr(settings, "CKEDITOR_5_FILE_UPLOAD_PERMISSION", "staff")
        if permission == "staff" and not request.user.is_staff:
            return JsonResponse(
                {
                    "error": {
                        "message": _("You do not have permission to upload files."),
                    },
                },
                status=403,
            )
        if permission == "authenticated" and not request.user.is_authenticated:
            return JsonResponse(
                {"error": {"message": _("You must be logged in to upload files.")}},
                status=403,
            )
        return view_func(request, *args, **kwargs)

    return _wrapped_view
