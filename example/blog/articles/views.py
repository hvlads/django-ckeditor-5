from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from .models import Article


class ArticleListView(ListView):
    """ All articles."""
    model = Article
    paginate_by = 100


class ArticleDetailView(DetailView):
    """ Article detail view."""
    model = Article
