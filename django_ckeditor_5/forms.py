from django import forms


class UploadFileForm(forms.Form):
    upload = forms.FileField()
