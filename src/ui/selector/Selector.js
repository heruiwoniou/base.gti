import Class from './../../core';
import {
    assign,
    isString,
    isFunction
} from './../../util'

const push = Array.prototype.push;
const forEach = Array.prototype.forEach;

var Selector = Class('ui.core.Selector', {
    constructor(selector) {
        let nodes;
        if (!selector) { return this; }
        if (selector.nodeType) {
            push.call(this, selector);
        } else if (isString(selector)) {
            nodes = document.querySelectorAll(selector);
            if (!nodes) {
                this.length = 0;
            } else {
                forEach.call(nodes, o => push.call(this, o));
            }
        }
        return this;
    },
    each(fuc) {
        if (isFunction(fuc)) {
            forEach.call(this, fuc);
        }
        return this;
    },
    static: {
        use(...arg) {
            assign(Selector.prototype, ...arg);
        }
    }
});
export default Selector;