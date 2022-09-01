from django.db import models

from .widgets import CKEditor5Widget


class CKEditor5Field(models.Field):
    def __init__(self, *args, config_name="default", **kwargs):
        self.config_name = config_name
        super().__init__(*args, **kwargs)

    def get_internal_type(self):
        return "TextField"

    def formfield(self, **kwargs):
        return super().formfield(
            **{
                "max_length": self.max_length,
                **({"widget": CKEditor5Widget(config_name=self.config_name)}),
                **kwargs,
            }
        )
