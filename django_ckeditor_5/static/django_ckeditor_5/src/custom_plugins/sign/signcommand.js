import Command from '@ckeditor/ckeditor5-core/src/command';

export default class SignCommand extends Command {
    execute(){
        this.editor.model.change( writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent( createSignBox( writer ) );
            //writer.appendElement( 'paragraph',createSignBox( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'signBox' );

        this.isEnabled = allowedIn !== null;
    }
}

function createSignBox( writer ) {
    const imageUrl = prompt( 'Image URL' );
    if (!imageUrl) return;
    const signBox = writer.createElement( 'signBox' );
    const authorImage = writer.createElement( 'authorImage' );
    const signDescription = writer.createElement( 'signDescription' );
    const signBoldDescription = writer.createElement( 'signBoldDescription' );

    writer.setAttribute('src', imageUrl, authorImage)
    writer.insertText( 'Christophe Baudia,', signBoldDescription);
    writer.insertText( 'CEO at GeoMoby ', signDescription);

    writer.append( authorImage, signBox );
    writer.append( signBoldDescription, signBox );
    writer.append( signDescription, signBox );

    return signBox;
}