import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import {toWidget, toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';
import SignCommand from "./signcommand";
import './sign.css';


export default class SignEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        console.log('SimpleBoxUI#init() got called');
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('addSign', new SignCommand(this.editor));

    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('signBox', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        });

        schema.register('authorImage', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'signBox',
            allowAttributes: ['src',],

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        });

        schema.register('signDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'signBox',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$block'
        });

        schema.register('signBoldDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'signBox',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$block'
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        // <signBox> converters
        conversion.for('upcast').elementToElement({
            model: 'signBox',
            view: {
                name: 'div',
                classes: 'sign-box'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'signBox',
            view: {
                name: 'div',
                classes: 'sign-box'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'signBox',
            view: (modelElement, viewWriter) => {
                const section = viewWriter.createContainerElement('div', {class: 'sign-box'});

                return toWidget(section, viewWriter, {label: 'sign box widget'});
            }
        });

        // <authorImage> converters
        conversion.for('upcast').elementToElement({
            model: (viewImage, modelWriter) => modelWriter.createElement('authorImage',
                {
                    class: 'sign-author-img',
                    src: viewImage.getAttribute('src')
                }),
            view: {
                name: 'img',
                classes: 'sign-author-img',
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'authorImage',
            view: (modelElement, viewWriter) => {

                const src = modelElement.getAttribute('src')
                const img = viewWriter.createEditableElement('img', {class: 'sign-author-img', src: src});
                return img;//toWidget(img, viewWriter);
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'authorImage',
            view: (modelElement, viewWriter) => {

                //alert( 'editingDowncast' )
                const src = modelElement.getAttribute('src')
                const img = viewWriter.createEditableElement('img', {class: 'sign-author-img', src: src});
                return img;//toWidget(img, viewWriter);
            }
        });

        // <signDescription> converters
        conversion.for('upcast').elementToElement({
            model: 'signDescription',
            view: {
                name: 'span',
                classes: 'sign-description'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'signDescription',
            view: {
                name: 'span',
                classes: 'sign-description'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'signDescription',
            view: (modelElement, viewWriter) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('span', {class: 'sign-description'});

                return toWidgetEditable(div, viewWriter);
            }
        });

        // <signBoldDescription> converters
        conversion.for('upcast').elementToElement({
            model: 'signBoldDescription',
            view: {
                name: 'strong',
                classes: 'sign-bold-desc'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'signBoldDescription',
            view: {
                name: 'strong',
                classes: 'sign-bold-desc'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'signBoldDescription',
            view: (modelElement, viewWriter) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('strong', {class: 'sign-bold-desc'});

                return toWidgetEditable(div, viewWriter);
            }
        });
    }
}