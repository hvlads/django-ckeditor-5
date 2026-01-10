from django_ckeditor_5.fields import CKEditor5Field
from django_ckeditor_5.widgets import CKEditor5Widget


def test_ckeditor5_field_internal_type(ckeditor5_field):
    assert ckeditor5_field.get_internal_type() == "TextField"


def test_ckeditor5_field_formfield(ckeditor5_field):
    formfield = ckeditor5_field.formfield()
    assert formfield.max_length == ckeditor5_field.max_length
    assert isinstance(formfield.widget, CKEditor5Widget)


def test_is_empty_html_detects_empty_content():
    """CKEditor5 empty patterns like <p>&nbsp;</p> should be detected as empty."""
    assert CKEditor5Field._is_empty_html("<p>&nbsp;</p>") is True


def test_is_empty_html_detects_real_content():
    """HTML with actual content should not be detected as empty."""
    assert CKEditor5Field._is_empty_html("<p>Hello</p>") is False


def test_blank_field_cleans_empty_html(ckeditor5_blank_field):
    """Field with blank=True should convert empty HTML to empty string."""
    assert ckeditor5_blank_field.get_prep_value("<p>&nbsp;</p>") == ""


def test_blank_field_preserves_content(ckeditor5_blank_field):
    """Field with blank=True should preserve actual content."""
    assert ckeditor5_blank_field.get_prep_value("<p>Hello</p>") == "<p>Hello</p>"


def test_required_field_preserves_empty_html(ckeditor5_field):
    """Field with blank=False should preserve empty HTML as-is."""
    assert ckeditor5_field.get_prep_value("<p>&nbsp;</p>") == "<p>&nbsp;</p>"
