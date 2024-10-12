from django import forms

from django_ckeditor_5.widgets import CKEditor5Widget

from .models import Article, Comment


class CommentForm(forms.ModelForm):
    """Custom storage for django_ckeditor_5 images."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["text"].required = False

    class Meta:
        model = Comment
        fields = ("author", "text")
        widgets = {
            "text": CKEditor5Widget(
                attrs={
                    "class": "django_ckeditor_5",
                    "name": "message",
                    "required": True,
                },
                config_name="comment",
            ),
        }


class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "text"]
        widgets = {
            "text": CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="comment",
            ),
            "text2": CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="comment",
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["text"].required = False
