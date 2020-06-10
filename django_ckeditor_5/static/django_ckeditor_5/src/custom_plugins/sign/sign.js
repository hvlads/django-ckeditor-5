import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SignEditing from "./signediting";
import SignUI from "./signui";

export default class Sign extends Plugin {
    static get requires() {
        return [ SignEditing, SignUI ];
    }
}