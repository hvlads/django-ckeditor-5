from django import get_version
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

if get_version() >= "4.0":
    from django.utils.translation import gettext_lazy as _
else:
    from django.utils.translation import ugettext_lazy as _


@deconstructible()
class FileMaxSizeValidator:
    """Validate that a file is not bigger than max_size mb, otherwise raise ValidationError.
    If zero is passed for max_size any file size is allowed.
    """

    message = _("File should be at most %(max_size)s MB.")
    code = "invalid_size"

    def __init__(self, max_size):
        self.max_size = max_size * 1024 * 1024
        self.orig_max_size = max_size

    def __call__(self, value):
        if value.size > self.max_size > 0:
            raise ValidationError(
                self.message,
                code=self.code,
                params={
                    "max_size": self.orig_max_size,
                },
            )

    def __eq__(self, other):
        return (
            isinstance(other, self.__class__)
            and self.max_size == other.max_size
            and self.message == other.message
            and self.code == other.code
        )
