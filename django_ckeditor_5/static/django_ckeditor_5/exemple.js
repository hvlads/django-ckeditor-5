import ClassicEditor from './src/ckeditor';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import './src/override-django.css';

let editors = [];

ClassicEditor
    .create(document.querySelector('#editor'), {
        'blockToolbar': [
            'paragraph', 'heading1', 'heading2', 'heading3',
            '|',
            'bulletedList', 'numberedList',
            '|',
            'blockQuote', 'imageUpload'
        ],
        'toolbar': ['heading', '|', 'outdent', 'indent', '|', 'bold', 'italic', 'link', 'underline', 'strikethrough',
            'code', 'subscript', 'superscript', 'highlight', '|',
            'bulletedList', 'numberedList', 'alignment', '|', 'blockQuote', 'imageUpload', '|',
            'fontColor', 'fontBackgroundColor', 'mediaEmbed', 'removeFormat',
            'insertTable',
        ],
        'image': {
            'toolbar': ['imageTextAlternative', 'imageTitle', '|', 'imageStyle:alignLeft', 'imageStyle:full',
                'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:side', '|'
            ],
            'styles': [
                'full',
                'side',
                'alignLeft',
                'alignRight',
                'alignCenter',
            ]

        },
        'link': {
            'decorators': {
                'addTargetToLinks': {
                    'mode': 'manual',
                    'label': 'Open in a new tab',
                    'attributes': {
                        'target': '_blank',
                        'rel': 'noopener noreferrer'
                    }
                }
            }
        },
        'table': {
            'contentToolbar': ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        },
        'heading': {
            'options': [
                { 'model': 'paragraph', 'title': 'Paragraph', 'class': 'ck-heading_paragraph' },
                { 'model': 'heading1', 'view': 'h1', 'title': 'Heading 1', 'class': 'ck-heading_heading1' },
                { 'model': 'heading2', 'view': 'h2', 'title': 'Heading 2', 'class': 'ck-heading_heading2' },
                { 'model': 'heading3', 'view': 'h3', 'title': 'Heading 3', 'class': 'ck-heading_heading3' },
                { 'model': 'heading4', 'view': 'h4', 'title': 'Heading 4', 'class': 'ck-heading_heading4' },
            ]
        },
        'simpleUpload': {
            'uploadUrl': 'http://localhost:8000/',
        }
    })
    .then(editor => {
        console.log(editor);
        editors.push(editor);
        CKEditorInspector.attach(editor);
        window.editors = editors;
    })
    .catch(error => {
        console.error(error);
    });