import html
import re

from django.db import models

from .widgets import CKEditor5Widget


class CKEditor5Field(models.Field):
    def __init__(self, *args, config_name="default", **kwargs) -> None:
        self.config_name = config_name
        super().__init__(*args, **kwargs)

    def get_internal_type(self) -> str:
        return "TextField"

    def formfield(self, **kwargs):
        return super().formfield(
            **{
                "max_length": self.max_length,
                **({"widget": CKEditor5Widget(config_name=self.config_name)}),
                **kwargs,
            },
        )

    @staticmethod
    def _is_empty_html(value):
        """Check if HTML content is effectively empty (e.g. '<p>&nbsp;</p>')."""
        if not value:
            return True
        if re.search(
            r"<(img|video|audio|iframe|embed|object|source)\b", value, re.IGNORECASE
        ):
            return False
        text = html.unescape(value)
        text = re.sub(r"<[^>]+>", "", text)
        return not text.strip()

    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if self.blank and value and self._is_empty_html(value):
            return ""
        return value
