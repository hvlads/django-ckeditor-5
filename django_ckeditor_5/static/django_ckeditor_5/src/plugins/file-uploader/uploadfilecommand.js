/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * Copyright (c) 2023 Liquid Democracy e.V.
 * For licensing, see LICENSE.md in this folder.
 */

import { Command } from '@ckeditor/ckeditor5-core';
import { FileRepository } from '@ckeditor/ckeditor5-upload';
import { toArray } from '@ckeditor/ckeditor5-utils';
import { findOptimalInsertionRange } from '@ckeditor/ckeditor5-widget';

/**
 * The upload file command, registered by FileUploadEditing as `uploadFile`.
 *
 * Inserts the file name as a text node carrying an `uploadId`, then FileUploadEditing
 * uploads the file and sets `linkHref` on that text once the server answers.
 *
 * ```js
 * editor.execute( 'uploadFile', { file: [ file1, file2 ] } );
 * ```
 */
export default class UploadFileCommand extends Command {
	refresh() {
		this.isEnabled = true;
	}

	/**
	 * @param {Object} options
	 * @param {File|Array<File>} options.file The file or files to upload.
	 */
	execute( options ) {
		const files = toArray( options.file );
		const selection = this.editor.model.document.selection;

		// Collected before the first insertion moves the selection, so every file inherits the same attributes.
		const selectionAttributes = Object.fromEntries( selection.getAttributes() );

		files.forEach( file => {
			this._uploadFile( file, selectionAttributes );
		} );
	}

	_uploadFile( file, attributes ) {
		const fileRepository = this.editor.plugins.get( FileRepository );
		const loader = fileRepository.createLoader( file );

		// Do not throw when upload adapter is not set. FileRepository will log an error anyway.
		if ( !loader ) {
			return;
		}

		this._insertFile( file, { ...attributes, linkHref: '', uploadId: loader.id } );
	}

	_insertFile( file, attributes = {} ) {
		const model = this.editor.model;
		const selection = model.document.selection;

		attributes = {
			...Object.fromEntries( selection.getAttributes() ),
			...attributes
		};

		for ( const attributeName in attributes ) {
			if ( !model.schema.checkAttribute( '$text', attributeName ) ) {
				delete attributes[ attributeName ];
			}
		}

		model.change( writer => {
			const fileElement = writer.createText( file.name, attributes );
			const insertAtSelection = findOptimalInsertionRange( selection, model );

			model.insertContent( fileElement, insertAtSelection );
		} );
	}
}
