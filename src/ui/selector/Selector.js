import Class from '../../core';
import {
    assign,
    isString,
    isFunction,
    forEach,
    push,
    slice,
    splice
} from '../../util'

var Selector = Class('ui.core.Selector', {
    constructor(selector) {
        let nodes;
        this.version = '1.0.0';
        this.length = 0;
        this.prevObject = this;
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
        instance.prevObject = this;
        forEach.call(result, o => instance.push(o));
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