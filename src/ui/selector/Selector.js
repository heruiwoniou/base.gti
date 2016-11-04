import Class from '../../core';
import {
    assign,
    isString,
    forEach
} from '../../util'
import core from './core';

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
    static: {
        use(...arg) {
            assign(Selector.prototype, ...arg);
        }
    }
});

Selector.use(core);

export default Selector;