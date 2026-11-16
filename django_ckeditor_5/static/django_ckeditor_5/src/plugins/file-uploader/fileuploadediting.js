/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * Copyright (c) 2023 Liquid Democracy e.V.
 * For licensing, see LICENSE.md in this folder.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { Notification } from '@ckeditor/ckeditor5-ui';
import { ClipboardPipeline } from '@ckeditor/ckeditor5-clipboard';
import { FileRepository } from '@ckeditor/ckeditor5-upload';

import UploadFileCommand from './uploadfilecommand';
import { createFileTypeRegExp } from './utils';

/**
 * The editing part of the file upload feature. It registers the `uploadFile` command.
 *
 * When a file is uploaded, it fires the `uploadComplete` event with `{ data, fileElement }`,
 * which allows adding custom attributes to the inserted link text.
 */
export default class FileUploadEditing extends Plugin {
	static get requires() {
		return [ FileRepository, Notification, ClipboardPipeline ];
	}

	static get pluginName() {
		return 'FileUploadEditing';
	}

	constructor( editor ) {
		super( editor );

		editor.config.define( 'fileUploader', {
			fileTypes: [ 'pdf' ]
		} );

		/**
		 * Upload id -> model item of the inserted link text, kept so an upload resolves
		 * against the right item even if the model changed in the meantime.
		 */
		this._uploadFileElements = new Map();
	}

	init() {
		const editor = this.editor;
		const doc = editor.model.document;
		const conversion = editor.conversion;
		const fileRepository = editor.plugins.get( FileRepository );
		const fileTypes = createFileTypeRegExp( editor.config.get( 'fileUploader.fileTypes' ) );
		const schema = editor.model.schema;

		editor.commands.add( 'uploadFile', new UploadFileCommand( editor ) );

		schema.extend( '$text', {
			allowAttributes: [ 'uploadId', 'uploadStatus' ]
		} );

		conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'a',
					key: 'uploadId'
				},
				model: 'uploadId'
			} );

		// Handle pasted and dropped files: every allowed file gets a loader and is inserted
		// as a link, then uploaded once it appears in the model (see the Document#change listener below).
		this.listenTo( editor.editing.view.document, 'clipboardInput', ( evt, data ) => {
			// Skip if non empty HTML data is included.
			// https://github.com/ckeditor/ckeditor5-upload/issues/68
			if ( isHtmlIncluded( data.dataTransfer ) ) {
				return;
			}

			const files = Array.from( data.dataTransfer.files ).filter( file => {
				if ( !file ) {
					return false;
				}

				return fileTypes.test( file.type );
			} );

			if ( !files.length ) {
				return;
			}

			evt.stop();

			editor.model.change( writer => {
				// Set selection to paste target.
				if ( data.targetRanges ) {
					writer.setSelection( data.targetRanges.map( viewRange => editor.editing.mapper.toModelRange( viewRange ) ) );
				}

				editor.execute( 'uploadFile', { file: files } );
			} );
		} );

		// Prevents the browser from navigating to the dropped file.
		editor.editing.view.document.on( 'dragover', ( evt, data ) => {
			data.preventDefault();
		} );

		// Upload placeholder links that appeared in the model.
		doc.on( 'change', () => {
			// Note: Reversing changes to start with insertions and only then handle removals. If it was the other way around,
			// loaders for **all** files that land in the $graveyard would abort while in fact only those that were **not** replaced
			// by other files should be aborted.
			const changes = doc.differ.getChanges( { includeChangesInGraveyard: true } ).reverse();
			const insertedFileIds = new Set();

			for ( const entry of changes ) {
				if ( entry.type == 'insert' ) {
					const item = entry.position.nodeAfter;
					const isInsertedInGraveyard = entry.position.root.rootName == '$graveyard';

					if ( !item ) {
						continue;
					}

					for ( const fileElement of getFilesFromChangeItem( editor, item ) ) {
						const uploadId = fileElement.getAttribute( 'uploadId' );

						if ( !uploadId ) {
							continue;
						}

						// Check if the file is loaded on this client.
						const loader = fileRepository.loaders.get( uploadId );

						if ( !loader ) {
							continue;
						}

						if ( isInsertedInGraveyard ) {
							// Abort only if the file landed in the graveyard for good (**not** replaced by another one).
							if ( !insertedFileIds.has( uploadId ) ) {
								loader.abort();
							}
						} else {
							insertedFileIds.add( uploadId );

							// Keep the mapping so the upload resolves in the context of the current model item,
							// which may replace an existing mapping for the same upload.
							this._uploadFileElements.set( uploadId, fileElement );

							if ( loader.status == 'idle' ) {
								this._readAndUpload( loader );
							}
						}
					}
				}
			}
		} );

		// Default handler: point the link at the uploaded file's URL.
		this.on( 'uploadComplete', ( evt, { fileElement, data } ) => {
			const urls = data.urls ? data.urls : data;

			this.editor.model.change( writer => {
				writer.setAttribute( 'linkHref', urls.default, fileElement );
			} );
		}, { priority: 'low' } );
	}

	/**
	 * Reads and uploads a file, tracking its progress in the `uploadStatus` attribute.
	 *
	 * @param {module:upload/filerepository~FileLoader} loader
	 * @returns {Promise}
	 */
	_readAndUpload( loader ) {
		const editor = this.editor;
		const model = editor.model;
		const t = editor.locale.t;
		const fileRepository = editor.plugins.get( FileRepository );
		const notification = editor.plugins.get( Notification );
		const fileUploadElements = this._uploadFileElements;

		model.enqueueChange( { isUndoable: false }, writer => {
			writer.setAttribute( 'uploadStatus', 'reading', fileUploadElements.get( loader.id ) );
		} );

		return loader.read()
			.then( () => {
				const promise = loader.upload();
				const fileElement = fileUploadElements.get( loader.id );

				model.enqueueChange( { isUndoable: false }, writer => {
					writer.setAttribute( 'uploadStatus', 'uploading', fileElement );
				} );

				return promise;
			} )
			.then( data => {
				model.enqueueChange( { isUndoable: false }, writer => {
					const fileElement = fileUploadElements.get( loader.id );

					writer.setAttribute( 'uploadStatus', 'complete', fileElement );

					this.fire( 'uploadComplete', { data, fileElement } );
				} );

				clean();
			} )
			.catch( error => {
				// If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
				// it might be generic error and it would be real pain to find what is going on.
				if ( loader.status !== 'error' && loader.status !== 'aborted' ) {
					throw error;
				}

				// Might be 'aborted'.
				if ( loader.status == 'error' && error ) {
					notification.showWarning( error, {
						title: t( 'Upload failed' ),
						namespace: 'upload'
					} );
				}

				// Permanently remove the file link from the insertion batch.
				model.enqueueChange( { isUndoable: false }, writer => {
					writer.remove( fileUploadElements.get( loader.id ) );
				} );

				clean();
			} );

		function clean() {
			model.enqueueChange( { isUndoable: false }, writer => {
				const fileElement = fileUploadElements.get( loader.id );

				writer.removeAttribute( 'uploadId', fileElement );
				writer.removeAttribute( 'uploadStatus', fileElement );

				fileUploadElements.delete( loader.id );
			} );

			fileRepository.destroyLoader( loader );
		}
	}
}

/**
 * Returns `true` if non-empty `text/html` is included in the data transfer.
 */
export function isHtmlIncluded( dataTransfer ) {
	return Array.from( dataTransfer.types ).includes( 'text/html' ) && dataTransfer.getData( 'text/html' ) !== '';
}

function getFilesFromChangeItem( editor, item ) {
	return Array.from( editor.model.createRangeOn( item ) )
		.filter( value => value.item.hasAttribute( 'linkHref' ) )
		.map( value => value.item );
}
