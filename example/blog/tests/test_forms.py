from django import forms

from django_ckeditor_5.forms import UploadFileForm


def test_upload_file_form_instance(upload_file_form):
    assert isinstance(upload_file_form, forms.Form)


def test_upload_file_form_field(upload_file_form):
    assert "upload" in upload_file_form.fields
    upload_field = upload_file_form.fields["upload"]
    assert isinstance(upload_field, forms.FileField)


def test_upload_file_form_invalid():
    # Create an invalid form without a file
    form = UploadFileForm(data={}, files={})
    assert not form.is_valid()
    assert "upload" in form.errors
    assert "This field is required." in form.errors["upload"]
