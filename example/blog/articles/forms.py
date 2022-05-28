from django import forms

from django_ckeditor_5.widgets import CKEditor5Widget
from .models import Comment


class CommentForm(forms.ModelForm):
    """Form for article comments."""

    class Meta:
        model = Comment
        fields = ("author", "text")
        widgets = {
            "text": CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"}, config_name="comment"
            )
        }
