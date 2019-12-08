/**
 *  This plugin has been rewritten from @ckeditor/ckeditor5-image/src/imagetextalternative
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageTitleEditing from './imagetitle/imagetitleediting';
import ImageTitleUI from './imagetitle/imagetitleui';

export default class ImageTitle extends Plugin {

	static get requires() {
		return [ ImageTitleEditing, ImageTitleUI ];
	}

	static get pluginName() {
		return 'ImageTitle';
	}
}
