import $ from 'jquery';
import './../bower_components/jquery-mousewheel/jquery.mousewheel';

import Editor from './core/config';
import BaseHtml from './core/html';
import Event from './core/event';
import Selection from './core/selection';
import Plugin, { load } from './core/plugin';

import { ie, lowie, gecko } from './core/browser';

import './plugins/insertHtml';
import './plugins/contextmenu';
import './plugins/table';


let editor_uid = 0;
export default class HtmlEditor extends Event {
    constructor(el, options) {
        super();
        this.uid = editor_uid++;
        this.el = $(el);
        this.options = options || {
            customDomain: null
        };
        this.iframe = null;
        this.selection = null;
        this.commands = {};
        this.plugin = new Plugin(this);

        Editor.instances['instance' + this.uid] = this;
        load(this);
    }

    get win() {
        return lowie ? this.iframe.get(0).contentWindow : window.frames[this.iframe.get(0).name]
    }

    get doc() {
        return lowie ? this.win.document : (this.iframe.get(0).contentDocument || this.win.document);
    }

    get width() {
        return this.iframe.width()
    }

    get padding() {
        return 5;
    }

    get height() {
        return this.iframe.height()
    }

    get frameLeft() {
        return this.iframe.position().left;
    }

    get frameTop() {
        return this.iframe.position().top;
    }

    execCommand(cmd, value) {
        var result;
        this.fireEvent('afterwindowclick');
        if (this.queryCommandState(cmd) == -1) {
            this.fireEvent('beforeexeccommand');
            result = this._callCmdFn('execCommand', arguments);
            this.fireEvent('afterexeccommand');
        }
        return result;
    }

    /**
     * 状态返回-1|0|1
     * 其中
     * -1未设置
     * 0为不可用
     * 1为已设置
     */
    queryCommandState(cmd) {
        return this._callCmdFn('queryCommandState', arguments)
    }

    queryCommandValue(cmd) {
        return this._callCmdFn('queryCommandValue', arguments)
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
        doc.body.innerHTML = '';

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
            src: `javascript:void(function(){document.open();${ (this.options.customDomain && document.domain != location.hostname ? 'document.domain="${ document.domain }";' : '') }document.write('${ BaseHtml(this.uid,this.padding) }');document.close();}())`
        });

        this.el.append(this.iframe);
        this.fireEvent('afterrender');
    }

    _initEvents() {
        var _domEventProxy = $.proxy(this._domEventProxy, this),
            me = this;
        $(this.doc).on('click contextmenu mousedown keydown keyup keypress selectstart mousewheel', _domEventProxy);
        $(document).on('mousewheel', _domEventProxy);
        $(window).on('resize', _domEventProxy)
        $(this.win).on('focus blur', _domEventProxy);
        $(this.win).on('click', function() {
            me.fireEvent('afterwindowclick');
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

    _callCmdFn(cmdName, args) {
        var cmd = args[0],
            value = args[1],
            cmdFn;
        cmd = this.commands[cmd] ? this.commands[cmd] : cmd;
        if (typeof cmd === 'string') {
            return this.doc[cmdName](cmd, false, value === undefined ? null : value);
        } else {
            cmdFn = cmd[cmdName];
            return cmdFn === undefined ? -1 : cmdFn.apply(this, [].splice.call(args, 1));
        }
    }
}