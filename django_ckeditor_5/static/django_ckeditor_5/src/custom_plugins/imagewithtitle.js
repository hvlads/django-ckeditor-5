import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageTitle from './imagetitle';
import ImageEditing from './imageediting';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import ImageTextAlternative from '@ckeditor/ckeditor5-image/src/imagetextalternative';

export default class ImageWithTitle extends Image {
	static get requires() {
		return [ ImageEditing, Widget, ImageTextAlternative, ImageTitle ];
	}

	static get pluginName() {
		return 'Image';
	}
}