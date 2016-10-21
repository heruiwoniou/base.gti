import $ from 'jquery';
import Event from '../core/event';

class ContextMenu extends Event {
    constructor(editor) {
        super();

        this.editor = editor;
        this.cm = null;
        this.sourceInstance = null;

        this._init();
    }

    show(instance, x, y, items) {
        if (!items || items.length == 0) return;
        this.sourceInstance = instance;
        this._renderContent(items);
        this.cm.css({
            left: x,
            top: y,
            marginLeft: '-9000px'
        }).show();
        var cmw = this.cm.width();
        var cmh = this.cm.height();
        if (x + cmw > document.body.offsetWidth) {
            this.cm.css({
                left: x - cmw
            })
        }

        this.cm.css({
            marginLeft: 0
        })
    }

    hide() {
        this.cm.hide();
        this.sourceInstance = null;
        this._destroyContent();
    }

    _init() {
        var that = this;

        this.cm = $(document.createElement('div'));
        this.cm.addClass('contextmenu');
        document.body.appendChild(this.cm.get(0));

        this._initDomEvent();

        this.on('click', function(type, e) {
            var cmd, target = e.target;
            if (target.className.indexOf('item') == -1)
                while ((target = target.parentElement) && target.className.indexOf('item') == -1 && target.className != 'contextmenu') continue;
            if (target && (cmd = target.getAttribute('command')))
                that.fireEvent('itemclick', that.sourceInstance, target.getAttribute('command'), e);
            else return false;
            that.editor.fireEvent('selectionchange');
        });

        this.on('mouseover', function(type, e) {
            var el = e.target || e.toElement,
                dl = 'swap-display-left',
                dr = 'swap-display-right';
            if (!el.getAttribute('command')) {
                var $parent = $(el.parentElement);
                var $ul = $parent.find('ul:first')
                var w = $parent.offset().left + $parent.width() + $ul.width();
                var d = w > (document.body.offsetWidth - 10);
                $parent.removeClass(d ? dr : dl).addClass(d ? dl : dr);
            }
        })

        this.editor.on('mousewheel selectionchange resize', function(type) {
            that.editor.execCommand('contextmenuhide')
        })
    }

    _renderContent(items, deep = 0) {
        let frag = document.createElement('ul'),
            i = -1,
            j,
            node,
            last;
        while (++i != items.length) {
            let item = items[i],
                hasChild = false,
                li = document.createElement('li');
            if (item === '-' || !item) {
                li.className = 'line';
                if (last && last.className == 'line') continue;
            } else {
                let text = document.createElement('a');
                let icon = document.createElement('i');
                let txt = document.createTextNode(item.text);
                icon.className = item.cls ? item.cls : ''
                text.appendChild(icon);
                text.appendChild(txt);
                text.className = 'item';
                if (item.command) text.setAttribute('command', item.command)
                text.setAttribute('deep', deep);
                li.appendChild(text);
                if (item.items && item.items !== 0) {
                    let childNode = this._renderContent(item.items, deep + 1);
                    if (childNode) {
                        li.appendChild(childNode);
                        hasChild = true;
                    }
                }
            }
            if (!(item && !item.command && !hasChild) || item === '-' || !item) {
                frag.appendChild(li);
                last = li;
            }
        }
        //clear start/end node
        let start, end;
        while (frag.children.length !== 0) {
            start = frag.children[0];
            end = frag.children[frag.children.length - 1];
            if (!(start.className === 'line' ? frag.removeChild(start) : false) &&
                !(end.className === 'line' ? frag.removeChild(end) : false))
                break;
        }
        return deep == 0 ? this.cm.get(0).appendChild(frag) : (frag.childNodes.length == 0 ? null : frag);
    }

    _destroyContent() {
        this.cm.empty();
    }

    _initDomEvent() {
        this.cm.on('click mouseover', '.item', $.proxy(this._itemEventProxy, this));
    }

    _itemEventProxy(e) {
        return this.fireEvent(e.type.replace(/^on/, '').toLowerCase(), e);
    }

}

Editor.plugins.contextmenu = function() {
    let cm = Editor.plugins.contextmenu.instance = new ContextMenu(this);
    this.commands.contextmenushow = {
        execCommand(instance, x, y, items) {
            cm.show(instance, x, y, items);
        }
    }
    this.commands.contextmenuhide = {
        execCommand() {
            cm.hide();
        }
    }
}