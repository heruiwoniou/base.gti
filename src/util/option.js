import {
    isObject,
    hasOwn
} from './lang';

export function assign(to, ...froms) {
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
export function trim(obj) {
    return obj.replace(/\s*&/i, '');
}
export const push = Array.prototype.push;
export const forEach = Array.prototype.forEach || function(fn) { for (var i = 0; i < this.length; i++) { fn.call(this[i], this[i], i); } };
export const slice = Array.prototype.slice;
export const splice = Array.prototype.splice;