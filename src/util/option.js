import {
    isObject,
    hasOwn
} from './lang';

export const assign = function(to, from) {
    var toVal, fromVal, key;
    for (key in from) {
        toVal = to[key]
        fromVal = from[key]
        if (!hasOwn(to, key)) {
            to[key] = fromVal;
        } else if (isObject(toVal) && isObject(fromVal)) {
            arguments.callee(toVal, fromVal);
        }
    }
    return to
}