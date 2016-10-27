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

export const isUndefined = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.UNDEFINED;
}
export const isNull = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.NULL;
}
export const isFunction = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.FUNCTION;
}
export const isObject = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.ARRAY;
}
export const isArray = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.ARRAY;
}
export const isBoolean = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.BOOLEAN;
}
export const isString = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.STRING;
}
export const isNumber = function() {
    return arguments.length == 0 ? false :
        _toString.apply(arguments[0]) === VARIABLE_TYPE.NUMBER;
}

export const _isConstructorDontEnum = function() {
    for (var key in { constructor: 1 }) {
        if (key === 'constructor') { return false; }
    }
    return true;
}

var hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = function(obj, key) {
    return hasOwnProperty.call(obj, key)
}