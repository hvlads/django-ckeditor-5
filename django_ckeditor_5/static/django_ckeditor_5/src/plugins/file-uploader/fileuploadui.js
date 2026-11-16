/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * Copyright (c) 2023 Liquid Democracy e.V.
 * For licensing, see LICENSE.md in this folder.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { FileDialogButtonView } from '@ckeditor/ckeditor5-ui';
import { IconFileUpload } from '@ckeditor/ckeditor5-icons';
import { add } from '@ckeditor/ckeditor5-utils';
import mime from 'mime';
import { createFileTypeRegExp } from './utils';

/**
 * Adds the `uploadFile` button, and `fileUpload` as an alias, to the UI component factory.
 */
export default class FileUploadUI extends Plugin {
	static get pluginName() {
		return 'FileUploadUI';
	}

	init() {
		add( 'de', { 'Insert file': 'Datei einfügen' } );

		const editor = this.editor;
		const t = editor.t;
		const componentCreator = locale => {
			const view = new FileDialogButtonView( locale );
			const command = editor.commands.get( 'uploadFile' );
			const fileTypes = editor.config.get( 'fileUploader.fileTypes' );
			const fileTypesRegExp = createFileTypeRegExp( fileTypes );

			// In v47 FileDialogButtonView is itself the button (older versions wrapped one in `buttonView`),
			// so the label, icon and state are set on the view directly.
			view.set( {
				acceptedType: fileTypes.map( type => mime.getType( type ) ).join( ',' ),
				allowMultipleFiles: true,
				label: t( 'Insert file' ),
				icon: IconFileUpload,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command );

			view.on( 'done', ( evt, files ) => {
				const filesToUpload = Array.from( files ).filter( file => fileTypesRegExp.test( file.type ) );

				if ( filesToUpload.length ) {
					editor.execute( 'uploadFile', { file: filesToUpload } );

					editor.editing.view.focus();
				}
			} );

			return view;
		};

		editor.ui.componentFactory.add( 'uploadFile', componentCreator );
		editor.ui.componentFactory.add( 'fileUpload', componentCreator );
	}
}
