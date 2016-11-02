import Class from '../../core';
import {
    assign,
    isString,
    isFunction
} from '../../util'

const push = Array.prototype.push;
const forEach = Array.prototype.forEach;
const slice = Array.prototype.slice;
const sort = Array.prototype.sort;
const splice = Array.prototype.splice;

var Selector = Class('ui.core.Selector', {
    constructor(selector) {
        let nodes;
        if (!selector) { return this; }
        if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
        } else if (isString(selector)) {
            nodes = document.querySelectorAll(selector);
            if (!nodes) {
                this.length = 0;
            } else {
                forEach.call(nodes, o => push.call(this, o));
            }
        }

        this.version = "1.0.0";

        return this;
    },
    toArray() {
        slice.apply(this);
    },
    slice:slice,
    push: push,
	sort: sort,
	splice: splice,
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