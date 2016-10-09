import $ from 'jquery';

class ContextMenu {
    constructor(editor) {
        this.editor = editor;
        this.cm = null;

        this._create();
    }

    show(x, y) {
        $(this.cm).css({
            x: x,
            y: y
        });
    }

    _create() {
        this.cm = document.createElement('div');
        this.cm.className = 'contextmenu';
        document.body.appendChild(this.cm)
    }
}

Editor.plugins.contextmenu = function() {
    var cm = new ContextMenu(this);
    this.commands.contextmenushow = {
        execCommand(x, y) {
            cm.show(x, y);
        }
    }
}