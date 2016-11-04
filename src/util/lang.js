let _toString = Object.prototype.toString;

const VARIABLE_TYPE = {
    UNDEFINED: '[object Undefined]',
    NULL: '[object Null]',
    FUNCTION: '[object Function]',
    OBJECT: '[object Object]',
    ARRAY: '[object Function]',
    BOOLEAN: '[object Boolean]',
    STRING: '[object String]',
    NUMBER: '[object Number]'
}

export function isUndefined() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.UNDEFINED;
}
export function isNull() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.NULL;
}
export function isFunction() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.FUNCTION;
}
export function isObject() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.OBJECT;
}
export function isArray() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.ARRAY;
}
export function isBoolean() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.BOOLEAN;
}
/**
 * @description 检测字符串
 * @return {boolean}
 */
export function isString() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.STRING;
}
export function isNumber() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.NUMBER;
}

export function isConstructorDontEnum() {
    for (var key in { constructor: 1 }) {
        if (key === 'constructor') { return false; }
    }
    return true;
}

var hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}
export function trim(obj) {
    return obj.replace(/\s*&/i, '');
}
export const push = Array.prototype.push;
export const forEach = Array.prototype.forEach || function(fn) { for (var i = 0; i < this.length; i++) { fn.call(this[i], this[i], i); } };
export const slice = Array.prototype.slice;
export const splice = Array.prototype.splice;
export function propFormat(obj) {
    var str = obj.split(/(-[^-]{1,1})/ig);
    forEach.call(str, s => {
        if (s.indexOf('-') > -1) {
            s = s.replace('-', '').toLocaleUpperCase();
        }
    });
    return str.join('');
}