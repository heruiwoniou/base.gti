import {
    isFunction,
    forEach,
    push,
    slice,
    splice
} from '../../../util'

export default {
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
    }
}