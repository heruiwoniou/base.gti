import Class from './../../core';
import {
    assign,
    isString
} from './../../util'

import doc from './doc';

const push = Array.prototype.push;
const concat = Array.prototype.concat;
const forEach = Array.prototype.forEach;

var Selector = Class('ui.core.Selector', {
    constructor(selector) {
        let nodes;
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
        forEach.call(this, fuc);
        return this;
    },
    /**
     * [addClass description]
     * 添加样式
     */
    addClass() {
        return this.each(function(el) {

        });
    },
    /**
     * [removeClass description]
     * 移除样式
     * @return {[type]} [description]
     */
    removeClass() {
        return this.each(function(el) {

        });
    },
    /**
     * [attr description]
     * 添加属性
     * @return {[type]} [description]
     */
    attr() {
        return this.each(function(el) {

        });
    },
    /**
     * [removeAttr description]
     * 移除属性
     * @return {[type]} [description]
     */
    removeAttr() {
        return this.each(function(el) {

        });
    },
    /**
     * [remove description]
     * 移除dom
     * @return {[type]} [description]
     */
    remove() {
        return this.each(function(el) {

        });
    },
    /**
     * [empty description]
     * 清空dom
     * @return {[type]} [description]
     */
    empty() {
        return this.each(function(el) {

        });
    }
});

Selector.use = function(proto) {
    assign(Selector.prototype, proto);
}

Selector.use(doc);

export default Selector;
