import ClassicEditor from './src/ckeditor';
import './src/override-django.css';


let editors = [];
let editorsIds = [];

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
        const script_id = `${allEditors[i].id}_script`;
        if (editorsIds.indexOf(script_id) !== -1){
            continue;
        }
        allEditors[i].nextSibling.remove();
        const upload_url = document.getElementById(
            `ck-editor-5-upload-url-${script_id}`
        ).getAttribute('data-upload-url');
        const csrf_cookie_name = document.getElementById(
            `ck-editor-5-upload-url-${script_id}`
        ).getAttribute('data-csrf_cookie_name');
        document.querySelector(`[for$="${allEditors[i].id}"]`).style.float = 'none';
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
            const wordCountPlugin = editor.plugins.get('WordCount');
            const wordCountWrapper = document.getElementById(`word-count-${script_id}`);
            wordCountWrapper.innerHTML = '';
            wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer);
            editors.push(editor);
        }).catch(error => {
            console.error((error));
        });
        editorsIds.push(script_id);
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

