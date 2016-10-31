import {
    isFunction,
    isString,
    isObject,
    isConstructorDontEnum,
    hasOwn
} from './../util'

import {
    Classes,
    getClassByNamespace
} from './library'

var overwrite = function(to, from) {
    return function Constructor() {
        let result, _super = this.super;
        this.super = function() {
            to.apply(this, arguments)
        }
        result = from.apply(this, arguments);
        this.super = _super;
        return result;
    }
};

function setInherit(to, from, deep = 0) {
    var toVal, fromVal, key;
    for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (isFunction(fromVal)) {
            to[key] = isFunction(toVal) ? overwrite(toVal, fromVal) : fromVal;
        } else if (isObject(fromVal)) {
            if (!hasOwn(to, key)) { to[key] = {}; }
            arguments.callee(to[key], fromVal, deep++);
        } else {
            to[key] = fromVal;
        }
    }
    if (deep === 0 && isConstructorDontEnum() && to.constructor) {
        to.constructor = overwrite(to.constructor, from.constructor);
    }

    return to
}

function Class(sub, options) {
    var sup, name, space, subclassProto, namespace
    sup = options.base || Object;
    if (options.base) { delete options.base; }
    if (isString(sup)) { sup = getClassByNamespace(sup); }
    namespace = options.namespace || Classes;
    if (options.namespace) { delete options.namespace; }


    space = sub.split('.');
    sub = space.pop();
    while ((name = space.shift()) != null) {
        if (!namespace[name]) { namespace[name] = {}; }
        namespace = namespace[name];
    }
    subclassProto = function() {
        var Super = function() {};
        Super.prototype = sup.prototype;
        return new Super()
    }();

    setInherit(subclassProto, options);
    sub = namespace[sub] = subclassProto.constructor;
    sub.prototype = subclassProto;
    sub.prototype.constructor = sub;
    if (Object.defineProperty) {
        Object.defineProperty(sub.prototype, 'constructor', {
            enumerable: false
        });
    }
    sub.prototype.super = function() {};

    return sub;
}

export default Class;
