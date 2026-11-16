/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * Copyright (c) 2023 Liquid Democracy e.V.
 * For licensing, see LICENSE.md in this folder.
 */

import mime from 'mime';

/**
 * Creates a regular expression matching the MIME types of the given file extensions.
 *
 * ```js
 * const fileType = createFileTypeRegExp( [ 'pdf', 'docx' ] );
 *
 * console.log( 'is supported file', fileType.test( file.type ) );
 * ```
 *
 * Extensions without a known MIME type are left out.
 *
 * @param {Array<string>} types
 * @returns {RegExp}
 */
export function createFileTypeRegExp( types ) {
	// Sanitize the MIME type name which may include: "+", "-" or ".".
	const regExpSafeNames = types.flatMap( type => {
		const safeType = type.replace( '+', '\\+' );
		const mimeType = mime.getType( safeType );

		if ( mimeType ) {
			return [ mimeType ];
		}

		return [];
	} );

	return new RegExp( `^${ regExpSafeNames.join( '|' ) }$` );
}
