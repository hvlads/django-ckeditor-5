/**
 * File uploader plugin: uploads any allowed file type and inserts it as a link.
 *
 * Ported to CKEditor 5 v47 from @liqd/ckeditor5-file-uploader v0.0.5
 * (https://github.com/liqd/ckeditor5-file-uploader), which was removed from the
 * bundle in 0.2.19 because it no longer worked with v47. See LICENSE.md in this folder.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import FileUploadEditing from './fileuploadediting';
import FileUploadUI from './fileuploadui';

export default class FileUploader extends Plugin {
	static get requires() {
		return [ FileUploadEditing, FileUploadUI ];
	}

	static get pluginName() {
		return 'FileUploader';
	}
}
