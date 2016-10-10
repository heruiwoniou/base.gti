import $ from 'jquery';

import Event from '../core/event';


class ContextMenu extends Event {
    constructor(editor) {
        super();

        this.editor = editor;
        this.cm = null;

        this._init();
    }

    show(x, y, items) {
        if (!items || items.length == 0) return;
        this._renderContent(items);
        this.cm.css({
            left: x,
            top: y
        }).fadeIn();
    }

    hide() {
        this.cm.hide();
        this._destroyContent();
    }

    _init() {
        var that = this;

        this.cm = $(document.createElement('div'));
        this.cm.addClass('contextmenu');
        document.body.appendChild(this.cm.get(0));

        this._initDomEvent();

        this.on('click', function(e) {
            that.fireEvent('itemclick', e.target.command, e)
        });
    }

    _renderContent(items, deep = 0) {
        let frag = document.createElement('ul'),
            i = -1;
        while (++i != items.length) {
            let item = items[i],
                li = document.createElement('li');
            if (item === '-') {
                li.className = 'line';
            } else {
                let text = document.createElement('a');
                text.innerHTML = item.text;
                text.className = 'item';
                text.setAttribute('deep', deep);
                li.appendChild(text);
                if (item.items && item.items !== 0) {
                    let childNode = this._renderContent(item.items, deep + 1);
                    li.appendChild(childNode);
                }
            }
            frag.appendChild(li);
        }
        return deep == 0 ? this.cm.get(0).appendChild(frag) : frag;
    }

    _destroyContent() {
        this.cm.empty();
    }

    _initDomEvent() {
        this.cm.on('click mousedown mouseup', '.item', $.proxy(this._itemEventProxy, this));
    }

    _itemEventProxy(e) {
        return this.fireEvent(e.type.replace(/^on/, '').toLowerCase(), e);
    }

}

Editor.plugins.contextmenu = function() {
    let cm = Editor.plugins.contextmenu.instance = new ContextMenu(this);
    this.commands.contextmenushow = {
        execCommand(x, y, items) {
            cm.show(x, y, items);
        }
    }
    this.commands.contextmenuhide = {
        execCommand() {
            cm.hide();
        }
    }
}