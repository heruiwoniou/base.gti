import { lowie } from './config';

export default class Selection {
    constructor(editor) {
        this.editor = editor;
    }

    get Selection() {
        return this.editor.doc.selection ?
            this.editor.doc.selection : this.editor.win.getSelection();
    }

    get Range() {
        if (this.Selection.rangeCount == 0) return undefined;
        return this.Selection.createRange ?
            this.Selection.createRange() : this.Selection.getRangeAt(0)
    }

    get Text() {
        if (this.Range) {
            return 'text' in this.Range ? this.Range.text : this.Range.toString();
        }
        return "";
    }
}