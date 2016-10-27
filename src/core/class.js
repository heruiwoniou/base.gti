import {
    isFunction,
    isString,
    isObject,
    _isConstructorDontEnum,
    hasOwn
} from './../util'

import {
    Classes,
    getClassByNamespace
} from './library'


var callParent = function(to, from) {
    return function() {
        let result, _callParent = this.callParent;
        this.callParent = function() {
            to.apply(this, arguments)
        }
        result = from.apply(this, arguments);
        this.callParent = _callParent;
        return result;
    }
};

function setInherit(to, from, deep = 0) {
    var toVal, fromVal, key;
    for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (isFunction(fromVal)) {
            to[key] = isFunction(toVal) ? callParent(toVal, fromVal) : fromVal;
        } else if (isObject(fromVal)) {
            if (!hasOwn(to, key)) { to[key] = {}; }
            setInherit(to[key], fromVal, deep++);
        } else {
            to[key] = fromVal;
        }
    }
    if (deep === 0 && _isConstructorDontEnum() && to.constructor) {
        to.constructor = callParent(to.constructor, from.constructor);
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
    subclassProto =
        Object.create ?
        Object.create(sup.prototype) :
        function() {
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
    sub.prototype.callParent = function() {};

    return sub;
}

export default Class;