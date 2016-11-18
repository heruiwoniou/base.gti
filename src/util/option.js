import { isObject, hasOwn } from './lang';
/**
 * 合并对象
 * @export
 * @param {any} to
 * @param {any} ...froms 任意个对象
 * @returns
 */
export function assign(to, ...froms) {
    var from,
        toVal,
        fromVal,
        key;
    for (var i = 0; i < froms.length; i++) {
        from = froms[i];
        for (key in from) {
            toVal = to[key];
            fromVal = from[key];
            if (isObject(toVal) && isObject(fromVal)) {
                assign(toVal, fromVal);
            } else if (!isObject(fromVal)) {
                to[key] = fromVal;
            } else if (isObject(fromVal)) {
                to[key] = assign({}, fromVal);
            }
        }
    }
    return to
}
if (!Object.assign)
    Object.assign = function(target) {
        'use strict';
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
if (!Function.prototype.bind)
    Function.prototype.bind = function(context) {
        var that = this;
        return function() {
            return that.apply(context, arguments);
        }
    }