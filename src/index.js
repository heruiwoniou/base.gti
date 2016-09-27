import { EDITOR, lowie } from './config';

import $ from 'jquery';

import { baseHtml } from './template/html';
import Event from './event';
import Selection from './selection';

let uid = 0;
export default class HtmlEditor extends Event {
    constructor(el, options) {
        super();
        this.uid = uid++;
        this.el = $(el);
        this.options = options || {
            customDomain: null
        };

        EDITOR.instances['instance' + this.uid] = this;

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
        this.doc.execCommand(cmd, false, value === undefined ? null : value);
    }

    setup(win, doc) {
        if (lowie) {
            doc.body.disabled = true;
            doc.body.contentEditable = true;
            doc.body.disabled = false;
        } else {
            doc.body.contentEditable = true;
        }
        doc.body.spellcheck = false;
        win.onclick = function() { doc.body.focus(); };
        this.selection = new Selection(this);
    }

    render() {
        this.iframe = $('<iframe></iframe>', {
            id: this.uid,
            marginHeight: 0,
            marginWidth: 0,
            frameBorder: 0,
            width: "100%",
            height: "100%",
            name: this.name ? this.name : 'editor',
            src: `javascript:void(function(){document.open();${ (this.options.customDomain && document.domain != location.hostname ? 'document.domain="${ document.domain }";' : '') }document.write('${ baseHtml(this.uid) }');document.close();}())`
        });

        this.el.append(this.iframe);
    }
}