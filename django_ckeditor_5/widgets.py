import json

from django import forms, get_version
from django.conf import settings
from django.forms.renderers import get_default_renderer
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import get_language

if get_version() >= "4.0":
    from django.utils.translation import gettext_lazy as _
else:
    from django.utils.translation import ugettext_lazy as _
from django.forms.utils import ErrorList

DEFAULT_CONFIG = {
    "toolbar": ["heading", "|", "bold", "italic"],
}


class CKEditor5Widget(forms.Widget):
    template_name = "django_ckeditor_5/widget.html"

    def __init__(self, config_name="default", attrs=None):
        self._config_errors = []
        self.config = DEFAULT_CONFIG.copy()
        try:
            configs = getattr(settings, "CKEDITOR_5_CONFIGS")
            try:
                self.config.update(configs[config_name])
            except (TypeError, KeyError, ValueError) as ex:
                self._config_errors.append(self.format_error(ex))
        except AttributeError as ex:
            self._config_errors.append(self.format_error(ex))

        default_attrs = {"class": "django_ckeditor_5"}
        if attrs:
            default_attrs.update(attrs)
        super().__init__(default_attrs)

    def format_error(self, ex):
        return "{} {}".format(
            _("Check the correct settings.CKEDITOR_5_CONFIGS "),
            str(ex),
        )

    class Media:
        css = {
            "all": [
                "django_ckeditor_5/dist/styles.css",
            ],
        }
        custom_css = getattr(settings, "CKEDITOR_5_CUSTOM_CSS", None)
        if custom_css:
            css["all"].append(custom_css)
        js = ["django_ckeditor_5/dist/bundle.js"]
        configs = getattr(settings, "CKEDITOR_5_CONFIGS", None)
        if configs is not None:
            for config in configs:
                language = configs[config].get("language")
                if language:
                    languages = []
                    if isinstance(language, dict) and language.get("ui"):
                        language = language.get("ui")
                    elif isinstance(language, str):
                        languages.append(language)
                    elif isinstance(language, list):
                        languages = language
                    for lang in languages:
                        if lang != "en":
                            js += [f"django_ckeditor_5/dist/translations/{lang}.js"]

    def render(self, name, value, attrs=None, renderer=None):
        context = super().get_context(name, value, attrs)
        use_language = getattr(settings, "CKEDITOR_5_USER_LANGUAGE", False)
        if use_language:
            language = get_language().lower()
            if language:
                self.config["language"] = language

        if renderer is None:
            renderer = get_default_renderer()

        context["config"] = self.config
        context["script_id"] = "{}{}".format(attrs["id"], "_script")
        context["upload_url"] = reverse(
            getattr(
                settings,
                "CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME",
                "ck_editor_5_upload_file",
            ),
        )
        context["upload_file_types"] = json.dumps(
            getattr(
                settings,
                "CKEDITOR_5_UPLOAD_FILE_TYPES",
                ["jpeg", "png", "gif", "bmp", "webp", "tiff"],
            ),
        )
        context["csrf_cookie_name"] = settings.CSRF_COOKIE_NAME
        if self._config_errors:
            context["errors"] = ErrorList(self._config_errors)

        return mark_safe(renderer.render(self.template_name, context))
