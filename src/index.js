import Q from './query';
import { baseHtml } from './template/html'
export default class HtmlEditor {
    constructor(el, options) {

        this.el = el;
        //框架
        this.iframe = null;

        this.options = options || {
            customDomain: null
        };

        this.render();
    }

    render() {
        this.iframe = document.createElement('iframe');
        var q = Q(this.iframe);
        this.iframe.marginHeight = 0;
        this.iframe.marginWidth = 0;
        this.iframe.frameBorder = 0;
        this.iframe.src =
            `javascript:void(function(){document.open();${ (this.options.customDomain && document.domain != location.hostname ? 'document.domain="${ document.domain }";' : '') }document.write('${ baseHtml }');document.close();}())`
        this.el.appendChild(this.iframe);
    }
}