import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageLoadObserver from '@ckeditor/ckeditor5-image/src/image/imageloadobserver';

import {
    modelToViewAttributeConverter,
    srcsetAttributeConverter,
    viewFigureToModel
} from '@ckeditor/ckeditor5-image/src/image/converters';

import {toImageWidget} from '@ckeditor/ckeditor5-image/src/image/utils';

import ImageInsertCommand from '@ckeditor/ckeditor5-image/src/image/insertimagecommand';

export default class ImageEditing extends Plugin {

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const t = editor.t;
        const conversion = editor.conversion;

        editor.editing.view.addObserver(ImageLoadObserver);

        // Configure schema.
        schema.register('image', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['alt', 'src', 'srcset', 'title']
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'image',
            view: (modelElement, viewWriter) => createImageViewElement(viewWriter)
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'image',
            view: (modelElement, viewWriter) => toImageWidget(createImageViewElement(viewWriter), viewWriter, t('image widget'))
        });

        conversion.for('downcast')
            .add(modelToViewAttributeConverter('src'))
            .add(modelToViewAttributeConverter('alt'))
            .add(modelToViewAttributeConverter('title'))
            .add(srcsetAttributeConverter());

        conversion.for('upcast')
            .elementToElement({
                view: {
                    name: 'img',
                    attributes: {
                        src: true
                    }
                },
                model: (viewImage, modelWriter) => modelWriter.createElement('image', {src: viewImage.getAttribute('src')})
            })
            .attributeToAttribute({
                view: {
                    name: 'img',
                    key: 'alt'
                },
                model: 'alt'
            })

            .attributeToAttribute({
                view: {
                    name: 'img',
                    key: 'title'
                },
                model: 'title'
            })
            .attributeToAttribute({
                view: {
                    name: 'img',
                    key: 'srcset'
                },
                model: {
                    key: 'srcset',
                    value: viewImage => {
                        const value = {
                            data: viewImage.getAttribute('srcset')
                        };

                        if (viewImage.hasAttribute('width')) {
                            value.width = viewImage.getAttribute('width');
                        }

                        return value;
                    }
                }
            })
            .add(viewFigureToModel());

        // Register imageUpload command.
        editor.commands.add('imageInsert', new ImageInsertCommand(editor));
    }
}

export function createImageViewElement(writer) {
    const emptyElement = writer.createEmptyElement('img');
    const figure = writer.createContainerElement('figure', {class: 'image'});

    writer.insert(writer.createPositionAt(figure, 0), emptyElement);

    return figure;
}
