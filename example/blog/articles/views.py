from django.conf import settings
from django.http import Http404, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import CreateView, FormView, TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from django_ckeditor_5.forms import UploadFileForm
from django_ckeditor_5.views import NoImageException, handle_uploaded_file, image_verify

from .forms import ArticleForm, CommentForm
from .models import Article


class ArticleListView(ListView):
    """All articles."""

    model = Article
    paginate_by = 100
    extra_context = {"media": CommentForm().media}


class ArticleDetailView(DetailView, FormView):
    """Article detail view."""

    model = Article
    form_class = CommentForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = CommentForm()
        context["comments"] = self.get_object().comments.all()
        return context

    def post(self, request, *args, **kwargs):
        form = CommentForm(request.POST, request.FILES)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.article = self.get_object()
            comment.save()
        success_url = reverse("article-detail", kwargs={"pk": self.get_object().id})
        return HttpResponseRedirect(success_url)


class ArticleCreateView(CreateView):
    """Article create view"""

    model = Article
    form_class = ArticleForm
    template_name = "articles/article_create.html"

    def get_success_url(self):
        return reverse("article-list")


class GetEditorView(TemplateView):
    template_name = "articles/dynamic_editor.html"
    extra_context = {"form": ArticleForm()}


def custom_upload_file(request):
    if request.method == "POST" and request.user.is_staff:
        form = UploadFileForm(request.POST, request.FILES)
        allow_all_file_types = getattr(
            settings,
            "CKEDITOR_5_ALLOW_ALL_FILE_TYPES",
            False,
        )

        if not allow_all_file_types:
            try:
                image_verify(request.FILES["upload"])
            except NoImageException as ex:
                return JsonResponse({"error": {"message": f"{ex}"}}, status=400)
        if form.is_valid():
            url = handle_uploaded_file(request.FILES["upload"])
            return JsonResponse({"url": url})
    raise Http404(_("Page not found."))
