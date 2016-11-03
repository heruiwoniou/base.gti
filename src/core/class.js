import {
    isFunction,
    isString,
    isObject,
    isConstructorDontEnum,
    hasOwn,
    assign
} from './../util'

import {
    Classes,
    getClassByNamespace
} from './library'

var overwrite = function(to, from) {
    return function Constructor() {
        let result, _super = this.callParent;
        this.callParent = function() {
            to.apply(this, arguments)
        }
        result = from.apply(this, arguments);
        if (_super) { this.callParent = _super; } else { delete this.callParent; }
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
    var sup, name, space, subclassProto, namespace, statics;
    sup = options.base || Object;
    statics = options.static || {};
    if (options.static) { delete options.static; }
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
    try {
        Object.defineProperty(sub.prototype, 'constructor', {
            enumerable: false
        });
    } catch (e) {}
    assign(sub, statics);

    return sub;
}

export default Class;