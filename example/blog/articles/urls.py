from django.urls import path

from .views import ArticleCreateView, ArticleDetailView, ArticleListView, GetEditorView

urlpatterns = [
    path("", ArticleListView.as_view(), name="article-list"),
    path("<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
    path("get_editor", GetEditorView.as_view(), name="get-editor"),
    path("create_article/", ArticleCreateView.as_view(), name="article-create"),
]
