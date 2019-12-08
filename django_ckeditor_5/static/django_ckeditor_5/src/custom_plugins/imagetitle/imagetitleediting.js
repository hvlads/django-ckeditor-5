import ImageTitleCommand from './imagetitlecommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ImageTitleEditing extends Plugin {
	init() {
		this.editor.commands.add( 'imageTitle', new ImageTitleCommand( this.editor ) );
	}
}
