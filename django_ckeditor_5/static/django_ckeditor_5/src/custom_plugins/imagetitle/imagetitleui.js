import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import TitleFormView from './ui/titleformview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import titleIcon from '../theme/title.svg';
import { repositionContextualBalloon, getBalloonPositionData } from '@ckeditor/ckeditor5-image/src/image/ui/utils';
import { getSelectedImageWidget } from '@ckeditor/ckeditor5-image/src/image/utils';;

export default class ImageTtitleUI extends Plugin {

	static get requires() {
		return [ ContextualBalloon ];
	}

	static get pluginName() {
		return 'ImageTitleUI';
	}

	init() {
		this._createButton();
		this._createForm();
	}

	destroy() {
		super.destroy();
		this._form.destroy();
	}

	_createButton() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'imageTitle', locale => {
			const command = editor.commands.get( 'imageTitle' );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Change image title' ),
				icon: titleIcon,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );

			this.listenTo( view, 'execute', () => this._showForm() );

			return view;
		} );
	}

	_createForm() {
		const editor = this.editor;
		const view = editor.editing.view;
		const viewDocument = view.document;

		this._balloon = this.editor.plugins.get( 'ContextualBalloon' );

		this._form = new TitleFormView( editor.locale );

		this._form.render();

		this.listenTo( this._form, 'submit', () => {
			editor.execute( 'imageTitle', {
				newValue: this._form.labeledInput.inputView.element.value
			} );

			this._hideForm( true );
		} );

		this.listenTo( this._form, 'cancel', () => {
			this._hideForm( true );
		} );

		this._form.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideForm( true );
			cancel();
		} );

		this.listenTo( editor.ui, 'update', () => {
			if ( !getSelectedImageWidget( viewDocument.selection ) ) {
				this._hideForm( true );
			} else if ( this._isVisible ) {
				repositionContextualBalloon( editor );
			}
		} );

		clickOutsideHandler( {
			emitter: this._form,
			activator: () => this._isVisible,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideForm()
		} );
	}

	_showForm() {
		if ( this._isVisible ) {
			return;
		}

		const editor = this.editor;
		const command = editor.commands.get( 'imageTitle' );
		const labeledInput = this._form.labeledInput;

		if ( !this._isInBalloon ) {
			this._balloon.add( {
				view: this._form,
				position: getBalloonPositionData( editor )
			} );
		}

		labeledInput.value = labeledInput.inputView.element.value = command.value || '';

		this._form.labeledInput.select();
	}

	_hideForm( focusEditable ) {
		if ( !this._isInBalloon ) {
			return;
		}

		if ( this._form.focusTracker.isFocused ) {
			this._form.saveButtonView.focus();
		}

		this._balloon.remove( this._form );

		if ( focusEditable ) {
			this.editor.editing.view.focus();
		}
	}

	get _isVisible() {
		return this._balloon.visibleView === this._form;
	}

	get _isInBalloon() {
		return this._balloon.hasView( this._form );
	}
}
