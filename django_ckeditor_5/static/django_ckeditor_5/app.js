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

document.addEventListener("DOMContentLoaded", () => {
    const allEditors = document.querySelectorAll('.django_ckeditor_5');
    for (let i = 0; i < allEditors.length; ++i) {
        const script_id = `${allEditors[i].id}_script`
        const upload_url = document.getElementById(
            `ck-editor-5-upload-url-${script_id}`
        ).getAttribute('data-upload-url');
        document.querySelector(`[for$="${allEditors[i].id}"]`).style.float = 'none';
        const config = JSON.parse(
            document.getElementById(script_id).textContent,
            (key, value) => {
                if(value.toString().includes('/')){
                    return new RegExp(value.replaceAll('/', ''));
                }
                return value;
            }
        );

        config['simpleUpload'] = {
            'uploadUrl': upload_url, 'headers': {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        }
        ClassicEditor.create(allEditors[i],
            config).then(editor => {
            editors.push(editor);
        }).catch(error => {

        });
    }
    window.editors = editors;
    window.ClassicEditor = ClassicEditor;
});
