import ClassicEditor from './src/ckeditor';
import './src/override-django.css';

window.ClassicEditor = ClassicEditor;
window.ckeditorRegisterCallback = registerCallback;
window.ckeditorUnregisterCallback = unregisterCallback;
window.editors = {};
let editors = {};
let callbacks = {};

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

/**
 * Checks whether the element or its children match the query and returns
 * an array with the matches.
 * 
 * @param {!HTMLElement} element
 * @param {!string} query
 * 
 * @returns {array.<HTMLElement>}
 */
function resolveElementArray(element, query) {
    return element.matches(query) ? [element] : [...element.querySelectorAll(query)];
}

/**
 * This function initializes the CKEditor inputs within an optional element and
 * assigns properties necessary for the correct operation
 * 
 * @param {HTMLElement} [element=document.body] - The element to search for elements
 * 
 * @returns {void}
 */
function createEditors(element = document.body) {
    const allEditors = resolveElementArray(element, '.django_ckeditor_5');

    allEditors.forEach(editorEl => {
        if (
            editorEl.id.indexOf('__prefix__') !== -1 ||
            editorEl.getAttribute('data-processed') === '1'
        ) {
            return;
        }
        const script_id = `${editorEl.id}_script`;
        // remove next sibling if it is an empty text node
        if (editorEl.nextSibling.nodeType == Node.TEXT_NODE && editorEl.nextSibling.textContent.trim() === '') {
          editorEl.nextSibling.remove();
        }
        const upload_url = element.querySelector(
            `#${script_id}-ck-editor-5-upload-url`
        ).getAttribute('data-upload-url');
        const upload_file_types = JSON.parse(element.querySelector(
            `#${script_id}-ck-editor-5-upload-url`
        ).getAttribute('data-upload-file-types'));
        const csrf_cookie_name = element.querySelector(
            `#${script_id}-ck-editor-5-upload-url`
        ).getAttribute('data-csrf_cookie_name');
        const labelElement = element.querySelector(`[for$="${editorEl.id}"]`);
        if (labelElement) {
            labelElement.style.float = 'none';
        }

        const config = JSON.parse(
            element.querySelector(`#${script_id}-span`).textContent,
            (key, value) => {
                var match = value.toString().match(new RegExp('^/(.*?)/([gimy]*)$'));
                if (match) {
                   var regex = new RegExp(match[1], match[2]);
                   return regex;
                }
                return value;
            }
        );
        config.simpleUpload = {
            'uploadUrl': upload_url,
            'headers': {
                'X-CSRFToken': getCookie(csrf_cookie_name),
            },
        };

        config.fileUploader = {
            'fileTypes': upload_file_types
        };
        config.licenseKey = 'GPL';
        ClassicEditor.create(
            editorEl,
            config
        ).then(editor => {

            const textarea = document.querySelector(`#${editorEl.id}`);
            editor.model.document.on('change:data', () => {
                textarea.value = editor.getData();
            });
            if (editor.plugins.has('WordCount')) {
                const wordCountPlugin = editor.plugins.get('WordCount');
                const wordCountWrapper = element.querySelector(`#${script_id}-word-count`);
                wordCountWrapper.innerHTML = '';
                wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer);
            }
            editors[editorEl.id] = editor;
            if (callbacks[editorEl.id]) {
                    callbacks[editorEl.id](editor);
                }
        }).catch(error => {
            console.error((error));
        });
        editorEl.setAttribute('data-processed', '1');
    });
    window.editors = editors;
}

/**
 * This function filters the list of mutations only by added elements, thus
 * eliminates the occurrence of text nodes and tags where it does not make sense
 * to try to use with `QuerySelectorAll()` and `matches()` functions.
 * 
 * @param {MutationRecord} recordList - It is the object inside the array
 * passed to the callback of a MutationObserver.
 * 
 * @returns {Array} Array containing filtered nodes.
 */
function getAddedNodes(recordList) {
    return recordList
        .flatMap(({ addedNodes }) => Array.from(addedNodes))
        .filter(node => node.nodeType === 1);
}

/**
 * Register a callback for when an editor with `id` is created.
 *
 * @param {!string} id - the id of the ckeditor element.
 * @callback callback - the callback function to be invoked.
 */
function registerCallback(id, callback) {
    callbacks[id] = callback;
}

/**
 * Unregister a previously registered callback.
 *
 * @param {!string} id - the id of the ckeditor element.
 */
function unregisterCallback(id) {
    callbacks[id] = null;
}

document.addEventListener("DOMContentLoaded", () => {
    createEditors();

    if (typeof django === "object" && django.jQuery) {
        django.jQuery(document).on("formset:added", () => {createEditors();});
    }

    const observer = new MutationObserver((mutations) => {
        let addedNodes = getAddedNodes(mutations);

        addedNodes.forEach(node => {
          // Initializes editors
          createEditors(node);
        });
    });

    // Configure MutationObserver options
    const observerOptions = {
        childList: true,
        subtree: true,
    };

    // Selects the parent element where the events occur
    const mainContent = document.body;

    // Starts to observe the selected father element with the configured options
    observer.observe(mainContent, observerOptions);
});
