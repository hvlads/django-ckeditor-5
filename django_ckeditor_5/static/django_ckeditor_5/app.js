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
                if (value.toString().includes('/')) {
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
        config['mediaEmbed'] = {
            extraProviders: [
                {
                    name: 'bilibili',
                    url: /bilibili\.com\/video\/([\w]+)\/\?([\s\S]+)/,
                    html: match => {
                        const id = match[1];
                        return (
                            '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 64%;">' +
                            `<iframe src="https//player.bilibili.com/player.html?aid=986434028&bvid=${id}&cid=856633420&page=1&high_quality=1" ` +
                            'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                            'frameborder="no" width="480" height="270" scrolling="no" allowfullscreen allow="autoplay">' +
                            '</iframe>' +
                            '</div>'
                        );
                    }
                },
            ],
            previewsInData: true,
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
