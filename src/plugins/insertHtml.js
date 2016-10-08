import { ie } from './../core/browser';

Editor.plugins.core = function() {
    this.commands.insertHtml = {
        execCommand(cmd, value) {
            if (ie && this.selection.Range.pasteHTML) {
                this.selection.Range.pasteHTML(value);
            } else {
                var sel, range;
                sel = this.selection.Selection;
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    var el = this.doc.createElement("div");
                    el.innerHTML = value;
                    var frag = this.doc.createDocumentFragment(),
                        node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
        }
    }
}