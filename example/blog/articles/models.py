from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Article(models.Model):
    """ Articles for blog. """
    title = models.CharField('Title', max_length=200)
    text = CKEditor5Field("Text", config_name='extends')
    image = models.ImageField(upload_to='ckeditor_test_app/images', null=True, blank=True)

    class Meta:
        verbose_name_plural = "Articles"
        verbose_name = "article"

    def __str__(self):
        return self.title
