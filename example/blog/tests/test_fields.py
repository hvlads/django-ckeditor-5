from django_ckeditor_5.widgets import CKEditor5Widget


def test_ckeditor5_field_internal_type(ckeditor5_field):
    assert ckeditor5_field.get_internal_type() == "TextField"


def test_ckeditor5_field_formfield(ckeditor5_field):
    formfield = ckeditor5_field.formfield()
    assert formfield.max_length == ckeditor5_field.max_length
    assert isinstance(formfield.widget, CKEditor5Widget)
