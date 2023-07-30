import ClassicEditor from './src/ckeditor';
import './src/override-django.css';


let editors = [];

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function createEditors() {
    const allEditors = document.querySelectorAll('.django_ckeditor_5');
    for (let i = 0; i < allEditors.length; ++i) {
        if (
            allEditors[i].id.indexOf('__prefix__') !== -1 ||
            allEditors[i].getAttribute('data-processed') === '1'
        ) {
            continue;
        }
        const script_id = `${allEditors[i].id}_script`;
        allEditors[i].nextSibling.remove();
        const upload_url = document.getElementById(
            `${script_id}-ck-editor-5-upload-url`
        ).getAttribute('data-upload-url');
        const csrf_cookie_name = document.getElementById(
            `${script_id}-ck-editor-5-upload-url`
        ).getAttribute('data-csrf_cookie_name');
        const labelElement = document.querySelector(`[for$="${allEditors[i].id}"]`);
        if (labelElement) {
            labelElement.style.float = 'none';
        }

        const config = JSON.parse(
            document.getElementById(script_id).textContent,
            (key, value) => {
                if (value.toString().includes('/')) {
                    return new RegExp(value.replaceAll('/', ''));
                }
                return value;
            }
        );
        config.simpleUpload = {
            'uploadUrl': upload_url, 'headers': {
                'X-CSRFToken': getCookie(csrf_cookie_name),
            }
        };
        ClassicEditor.create(
            allEditors[i],
            config
        ).then(editor => {
            if (editor.plugins.has('WordCount')) {
                const wordCountPlugin = editor.plugins.get('WordCount');
                const wordCountWrapper = document.getElementById(`${script_id}-word-count`);
                wordCountWrapper.innerHTML = '';
                wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer);
            }
            editors.push(editor);
        }).catch(error => {
            console.error((error));
        });
        allEditors[i].setAttribute('data-processed', '1');
    }
    window.editors = editors;
    window.ClassicEditor = ClassicEditor;
}

document.addEventListener("DOMContentLoaded", () => {
    createEditors();
    if (typeof django === "object" && django.jQuery) {
        django.jQuery(document).on("formset:added", createEditors);
    }
});

