import {
    forEach
} from '../../../util'
export default {
    find(selector) {
        var instance = new this.constructor();
        instance.prevObject = this;
        this.each(el => {
            var nodes = el.querySelectorAll(selector);
            forEach.call(nodes, node => {
                instance.push(node);
            })
        })
        return instance;
    },
    filter(selector) {
        var instance = new this.constructor();
        instance.prevObject = this;
        var selectors = new this.constructor(selector);
        this.each(el => {
            selectors.each(s => {
                if (el === s) {
                    instance.push(s)
                }
            })
        });
        return instance;
    },
    end() {
        return this.prevObject;
    }
}