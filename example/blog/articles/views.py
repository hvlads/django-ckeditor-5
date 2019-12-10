from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from .models import Article


class ArticleListView(ListView):

    model = Article
    paginate_by = 100  # if pagination is desired


class ArticleDetailView(DetailView):

    model = Article