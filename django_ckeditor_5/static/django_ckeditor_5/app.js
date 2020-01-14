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
    let allEditors = document.querySelectorAll('.django_ckeditor_5');
    for (let i = 0; i < allEditors.length; ++i) {
        let script_id = `${allEditors[i].id}_script`
        document.querySelector(`[for$="${allEditors[i].id}"]`).style.float = 'none';
        let config = JSON.parse(document.getElementById(script_id).textContent);
        
        config['simpleUpload'] = {
            'uploadUrl': '/ckeditor5/image_upload/', 'headers': {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        }
        //console.log(config)
        ClassicEditor.create(allEditors[i],
            config).then( editor => {
                editors.push(editor);        
            } ).catch(error => {

            });
    }
    window.editors = editors;
    window.ClassicEditor = ClassicEditor;
});
