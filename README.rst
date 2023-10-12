Django CKEditor 5 
==================

   CKEditor 5 for Django >= 2.0

Quick start
-----------

 .. code-block:: bash
 
        pip install django-ckeditor-5

1. Add "django_ckeditor_5" to your INSTALLED_APPS in your `project/settings.py` like this:

 .. code-block:: python

        INSTALLED_APPS = [
            ...
            'django_ckeditor_5',
        ]


2. Also, in your `project/settings.py` add:

  .. code-block:: python

      STATIC_URL = '/static/'
      MEDIA_URL = '/media/'
      MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

      customColorPalette = [
            {
                'color': 'hsl(4, 90%, 58%)',
                'label': 'Red'
            },
            {
                'color': 'hsl(340, 82%, 52%)',
                'label': 'Pink'
            },
            {
                'color': 'hsl(291, 64%, 42%)',
                'label': 'Purple'
            },
            {
                'color': 'hsl(262, 52%, 47%)',
                'label': 'Deep Purple'
            },
            {
                'color': 'hsl(231, 48%, 48%)',
                'label': 'Indigo'
            },
            {
                'color': 'hsl(207, 90%, 54%)',
                'label': 'Blue'
            },
        ]

      CKEDITOR_5_CUSTOM_CSS = 'path_to.css' # optional
      CKEDITOR_5_FILE_STORAGE = "path_to_storage.CustomStorage" # optional
      CKEDITOR_5_UPLOAD_FILE_TYPES = ['jpeg', 'pdf', 'png'] # optional
      CKEDITOR_5_CONFIGS = { 
        'default': {
            'toolbar': ['heading', '|', 'bold', 'italic', 'link',
                        'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', ],
    
        },
        'extends': {
            'blockToolbar': [
                'paragraph', 'heading1', 'heading2', 'heading3',
                '|',
                'bulletedList', 'numberedList',
                '|',
                'blockQuote',
            ],
            'toolbar': ['heading', '|', 'outdent', 'indent', '|', 'bold', 'italic', 'link', 'underline', 'strikethrough',
            'code','subscript', 'superscript', 'highlight', '|', 'codeBlock', 'sourceEditing', 'insertImage',
                        'bulletedList', 'numberedList', 'todoList', '|',  'blockQuote', 'imageUpload', '|',
                        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'mediaEmbed', 'removeFormat',
                        'insertTable',],
            'image': {
                'toolbar': ['imageTextAlternative', '|', 'imageStyle:alignLeft',
                            'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:side',  '|'],
                'styles': [
                    'full',
                    'side',
                    'alignLeft',
                    'alignRight',
                    'alignCenter',
                ]
    
            },
            'table': {
                'contentToolbar': [ 'tableColumn', 'tableRow', 'mergeTableCells',
                'tableProperties', 'tableCellProperties' ],
                'tableProperties': {
                    'borderColors': customColorPalette,
                    'backgroundColors': customColorPalette
                },
                'tableCellProperties': {
                    'borderColors': customColorPalette,
                    'backgroundColors': customColorPalette
                }
            },
            'heading' : {
                'options': [
                    { 'model': 'paragraph', 'title': 'Paragraph', 'class': 'ck-heading_paragraph' },
                    { 'model': 'heading1', 'view': 'h1', 'title': 'Heading 1', 'class': 'ck-heading_heading1' },
                    { 'model': 'heading2', 'view': 'h2', 'title': 'Heading 2', 'class': 'ck-heading_heading2' },
                    { 'model': 'heading3', 'view': 'h3', 'title': 'Heading 3', 'class': 'ck-heading_heading3' }
                ]
            }
        },
        'list': {
            'properties': {
                'styles': 'true',
                'startIndex': 'true',
                'reversed': 'true',
            }
        }
    }


3. Include the app URLconf in your `project/urls.py` like this:
 
  .. code-block:: python

       from django.conf import settings
       from django.conf.urls.static import static
       
       # [ ... ]
       
       urlpatterns += [ 
           path("ckeditor5/", include('django_ckeditor_5.urls'), name="ck_editor_5_upload_file"),
       ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    
4. Add to your `project/models.py`:

  .. code-block:: python


        from django.db import models
        from django_ckeditor_5.fields import CKEditor5Field
        
        
        class Article(models.Model):
            title=models.CharField('Title', max_length=200)
            text=CKEditor5Field('Text', config_name='extends')
            

Includes the following ckeditor5 plugins:

            Essentials,
            UploadAdapter,
            CodeBlock,
            Autoformat,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Code,
            Subscript,
            Superscript,
            BlockQuote,
            Heading,
            Image,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageResize,
            Link,
            List,
            Paragraph,
            Alignment,
            Font,
            PasteFromOffice,
            SimpleUploadAdapter,
            MediaEmbed,
            RemoveFormat,
            Table,
            TableToolbar,
            TableCaption,
            TableProperties,
            TableCellProperties,
            Indent,
            IndentBlock,
            Highlight,
            TodoList,
            ListProperties,
            SourceEditing,
            GeneralHtmlSupport,
            ImageInsert,
            WordCount,
            Mention,
            Style,
            HorizontalLine,
            LinkImage


Examples
-----------

Example of using a widget in a form:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  .. code-block:: python

      from django import forms

      from django_ckeditor_5.widgets import CKEditor5Widget
      from .models import Comment


      class CommentForm(forms.ModelForm):
            """Form for comments to the article."""

            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                self.fields["text"].required = False

            class Meta:
                model = Comment
                fields = ("author", "text")
                widgets = {
                    "text": CKEditor5Widget(
                        attrs={"class": "django_ckeditor_5"}, config_name="comment"
                    )
                }


Custom storage example:
^^^^^^^^^^^^^^^^^^^^^^^
  .. code-block:: python

      import os
      from urllib.parse import urljoin

      from django.conf import settings
      from django.core.files.storage import FileSystemStorage


      class CustomStorage(FileSystemStorage):
          """Custom storage for django_ckeditor_5 images."""

          location = os.path.join(settings.MEDIA_ROOT, "django_ckeditor_5")
          base_url = urljoin(settings.MEDIA_URL, "django_ckeditor_5/")

Installing from GitHub:
^^^^^^^^^^^^^^^^^^^^^^^
  .. code-block:: bash

    cd your_root_project
    git clone https://github.com/hvlads/django-ckeditor-5.git
    cd django-ckeditor-5
    yarn install
    yarn run prod
    cd your_root_project
    python manage.py collectstatic
    
Example Sharing content styles between front-end and back-end:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To apply ckeditor5 styling outside of the editor, download content.styles.css from the official ckeditor5 docs and include it as a styleshet within your HTML template. You will need to add the ck-content class to the container of your content for the styles to be applied.
`<https://ckeditor.com/docs/ckeditor5/latest/installation/advanced/content-styles.html#sharing-content-styles-between-frontend-and-backend>`_

.. code-block:: html

   <link rel="stylesheet" href="path/to/assets/content-styles.css" type="text/css">
   ...
   <div class="ck-content">
   <p>ckeditor content</p>
   </div>
