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

    # Define a constant in settings.py to specify file upload permissions
    CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"  # Possible values: "staff", "authenticated", "any"

3. Include the app URLconf in your `project/urls.py` like this:
 
  .. code-block:: python

       from django.conf import settings
       from django.conf.urls.static import static
       
       # [ ... ]
       
       urlpatterns += [ 
           path("ckeditor5/", include('django_ckeditor_5.urls')),
       ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

  Alternatively, you can use your own logic for file uploads. To do this, add the following to your `settings.py` file:

  .. code-block:: python

    # Define a constant in settings.py to specify the custom upload file view
    CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME = "custom_upload_file"

  Then, in your `urls.py`, include the custom upload URL pattern:

  .. code-block:: python

     path("upload/", custom_upload_function, name="custom_upload_file"),

This allows users to customize the upload file logic by specifying their own view function and URL pattern.






    
    
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
            LinkImage,
            HtmlEmbed,
            FullPage,
            SpecialCharacters,
            ShowBlocks,
            SelectAll,
            FindAndReplace,
            FullScreen


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

Example of using a widget in a template:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  .. code-block:: python

    {% extends 'base.html' %}
    {% block header %}
        {{ form.media }} # Required for styling/js to make ckeditor5 work
    {% endblock %}
    {% block content %}
        <form method="POST">
            {% csrf_token %}
            {{ form.as_p }}
            <input type="submit" value="Submit article">
        </form>
    {% endblock %}

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


Changing the language:
^^^^^^^^^^^^^^^^^^^^^^
You can change the language via the ``language`` key in the config

 .. code-block:: python

      CKEDITOR_5_CONFIGS = {
        'default': {
            'toolbar': ['heading', '|', 'bold', 'italic', 'link',
                        'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', ],
            'language': 'de',
        },

``language`` can be either:

1. a string containing a single language
2. a list of languages
3. a dict ``{"ui": <a string (1) or a list of languages (2)>}``

If you want the language to change with the user language in django
you can add ``CKEDITOR_5_USER_LANGUAGE=True`` to your django settings.
Additionally you will have to list all available languages in the ckeditor
config as shown above.

Creating a CKEditor5 instance from javascript:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To create a ckeditor5 instance dynamically from javascript you can use the
``ClassicEditor`` class exposed through the ``window`` global variable.

  .. code-block:: javascript

    const config = {};
    window.ClassicEditor
       .create( document.querySelector( '#editor' ), config )
       .catch( error => {
           console.error( error );
       } );
    }

Alternatively, you can create a form with the following structure:

  .. code-block:: html

    <form method="POST">
        <div class="ck-editor-container">
            <textarea id="id_text" name="text" class="django_ckeditor_5" >
            </textarea>
            <div></div> <!-- this div or any empty element is required -->
            <span class="word-count" id="id_text_script-word-count"></span>
       </div>
       <input type="hidden" id="id_text_script-ck-editor-5-upload-url" data-upload-url="/ckeditor5/image_upload/" data-csrf_cookie_name="new_csrf_cookie_name">
       <span id="id_text_script-span"><script id="id_text_script" type="application/json">{your ckeditor config}</script></span>
    </form>

The ckeditor will be automatically created once the form has been added to the
DOM.

To access a ckeditor instance you can either get them through ``window.editors``

  .. code-block:: javascript

    const editor = windows.editors["<id of your field>"];

or by registering a callback

  .. code-block:: javascript

    //register callback
    window.ckeditorRegisterCallback("<id of your field>", function(editor) {
      // do something with editor
    });
    // unregister callback
    window.ckeditorUnregisterCallback("<id of your field>");


Allow file uploading as link:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
By default only images can be uploaded and embedded in the content. To allow
uploading and embedding files as downloadable links you can add the following
to your config:

 .. code-block:: python

      CKEDITOR_5_ALLOW_ALL_FILE_TYPES = True
      CKEDITOR_5_UPLOAD_FILE_TYPES = ['jpeg', 'pdf', 'png'] # optional
      CKEDITOR_5_CONFIGS = {
        'default': {
            'toolbar': ['heading', '|', 'bold', 'italic', 'link',
                        'bulletedList', 'numberedList', 'blockQuote', 'imageUpload' ], # include fileUpload here
            'language': 'de',
        },
      }


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
