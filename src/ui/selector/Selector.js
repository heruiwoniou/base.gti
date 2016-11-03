import Class from '../../core';
import {
    assign,
    isString,
    isFunction
} from '../../util'

const push = Array.prototype.push;
const forEach = Array.prototype.forEach;
const slice = Array.prototype.slice;
const splice = Array.prototype.splice;

var Selector = Class('ui.core.Selector', {
    constructor(selector) {
        let nodes;
        this.version = '1.0.0';
        this.length = 0;
        if (!selector) { return this; }
        if (selector.nodeType || selector == window || selector == document) {
            this.push(selector);
        } else if (isString(selector)) {
            nodes = document.querySelectorAll(selector);
            if (nodes.length === 0) {
                this.length = 0;
            } else {
                forEach.call(nodes, o => this.push(o));
            }
        }
        return this;
    },
    toArray() {
        return slice.apply(this);
    },
    slice() {
        var result = slice.apply(this, arguments);
        var instance = new this.constructor();
        result.forEach(o => instance.push(o));
        return instance;
    },
    push() {
        push.apply(this, arguments);
        return this;
    },
    splice() {
        splice.apply(this, arguments);
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