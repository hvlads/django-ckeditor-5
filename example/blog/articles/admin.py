from django.contrib import admin

from .models import Article, Comment


class CommentAdminInline(admin.StackedInline):
    model = Comment
    extra = 0


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    inlines = [
        CommentAdminInline,
    ]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
