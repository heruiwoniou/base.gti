import { fillChar } from './const';
import { lowie } from './browser';
let getFirstTextNode = function(node) {
    var children = node.childNodes,
        result;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 3) { result = children[i]; break; }
        if (result = getFirstTextNode(children[i])) { break; }
    }
    if (!result) {
        result = node.ownerDocument.createTextNode(fillChar);
        node.appendChild(result);
    };
    return result;
}
export default class Selection {
    constructor(editor) {
        this.editor = editor;
    }

    get anchorNode() {
        return lowie ? this.Range.parentElement() : this.Selection.anchorNode;
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

    clear() {
        if (lowie) this.Selection.clear();
        else this.Selection.removeAllRanges();
    }

    select(node) {
        if (lowie) this.Selection.clear();
        else this.Selection.removeAllRanges();
        let range = this.editor.doc.createRange();
        let txtNode = getFirstTextNode(node);
        range.setStart(txtNode, 0)
        if (!lowie) this.Selection.addRange(range);
    }
}