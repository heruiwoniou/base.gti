import {
    forEach
} from '../../../util'
export default {
    find(selector) {
        var instance = new this.constructor();
        this.each(el => {
            var nodes = el.querySelectorAll(selector);
            forEach.call(nodes, node => {
                instance.push(node);
            })
        })
        return instance;
    }
}