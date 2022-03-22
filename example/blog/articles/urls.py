from .views import ArticleListView, ArticleDetailView
from django.urls import path

urlpatterns = [
    path("", ArticleListView.as_view(), name="article-list"),
    path("<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
]
