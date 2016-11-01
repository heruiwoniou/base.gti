import {
    isObject,
    hasOwn
} from './lang';

export const assign = function(to, ...froms) {
    var from, toVal, fromVal, key;
    for (var i = 0; i < froms.length; i++) {
        from = froms[i];
        for (key in from) {
            toVal = to[key]
            fromVal = from[key]
            if (!hasOwn(to, key)) {
                to[key] = fromVal;
            } else if (isObject(toVal) && isObject(fromVal)) {
                arguments.callee(toVal, fromVal);
            }
        }
    }
    return to
}