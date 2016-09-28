import $ from 'jquery';

import Editor from './core/config';
import BaseHtml from './core/html';
import Event from './core/event';
import Selection from './core/selection';

import { ie, lowie, gecko } from './core/browser';


let uid = 0;
export default class HtmlEditor extends Event {
    constructor(el, options) {
        super();
        this.uid = uid++;
        this.el = $(el);
        this.options = options || {
            customDomain: null
        };

        Editor.instances['instance' + this.uid] = this;

        this.iframe = null;
        this.selection = null;
    }

    get win() {
        return lowie ? this.iframe.get(0).contentWindow : window.frames[this.iframe.get(0).name]
    }

    get doc() {
        return lowie ? this.win.document : (this.iframe.get(0).contentDocument || this.win.document);
    }

    execCommand(cmd, value) {
        cmd = Editor.plugins[cmd] ? Editor.plugins[cmd] : cmd;
        if (typeof cmd === 'string') {
            this.fireEvent('afterwindowclick')
            this.doc.execCommand(cmd, false, value === undefined ? null : value);
        } else {
            cmd.execCommand.apply(this, arguments);
        }
    }

    setup(win, doc) {
        this.fireEvent('beforesetup');
        if (lowie) {
            doc.body.disabled = true;
            doc.body.contentEditable = true;
            doc.body.disabled = false;
        } else {
            doc.body.contentEditable = true;
        }
        doc.body.spellcheck = false;

        this._initEvents();

        try {
            doc.execCommand('2D-position', false, false);
        } catch (e) {}
        try {
            doc.execCommand('enableInlineTableEditing', false, false);
        } catch (e) {}
        try {
            doc.execCommand('enableObjectResizing', false, false);
        } catch (e) {}

        this.on('afterwindowclick', function() { doc.body.focus(); });
        this.selection = new Selection(this);

        this.fireEvent('aftersetup');
    }

    render() {
        this.fireEvent('before');
        this.iframe = $('<iframe></iframe>', {
            id: this.uid,
            marginHeight: 0,
            marginWidth: 0,
            frameBorder: 0,
            width: "100%",
            height: "100%",
            name: this.name ? this.name : 'editor',
            src: `javascript:void(function(){document.open();${ (this.options.customDomain && document.domain != location.hostname ? 'document.domain="${ document.domain }";' : '') }document.write('${ BaseHtml(this.uid) }');document.close();}())`
        });

        this.el.append(this.iframe);
        this.fireEvent('afterrender');
    }

    _initEvents() {
        var _proxyDomEvent = $.proxy(this._proxyDomEvent, this),
            me = this;
        $(this.doc).on('click contextmenu mousedown keydown keyup keypress mouseup mouseover mouseout selectstart', _proxyDomEvent);
        $(this.win).on('focus blur', _proxyDomEvent);
        $(this.win).on('click', function() {
            me.fireEvent('afterwindowclick')
        })

        $(this.doc.body).on('drop', function(e) {
            //阻止ff下默认的弹出新页面打开图片
            if (gecko && e.stopPropagation) { e.stopPropagation(); }
            me.fireEvent('contentchange')
        });

        $(this.doc).on('mouseup keydown', function(e) {
            //特殊键不触发selectionchange
            if (e.type == 'keydown' && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) {
                return;
            }
            if (e.button == 2) return;
            setTimeout(function() {
                me.fireEvent('selectionchange');
            });
        });
    }

    _domEventProxy(e) {
        if (this.fireEvent('before' + e.type.replace(/^on/, '').toLowerCase()) === false) {
            return false;
        }
        if (this.fireEvent(e.type.replace(/^on/, ''), e) === false) {
            return false;
        }
        return this.fireEvent('after' + e.type.replace(/^on/, '').toLowerCase())
    }
}