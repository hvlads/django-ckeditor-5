from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Article(models.Model):
    """Articles for blog."""

    title = models.CharField("Title", max_length=200, null=True)
    text = CKEditor5Field("Text", config_name="extends")
    text2 = CKEditor5Field("Text 2", config_name="extends", null=True, blank=True)

    class Meta:
        verbose_name_plural = "Articles"
        verbose_name = "article"

    def __str__(self):
        return self.title
