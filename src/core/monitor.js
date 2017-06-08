import EventBase from './event';

function _observe(instance, data, namespace) {
    namespace = namespace || [instance.monitor_uid];
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
        _defineReactive(instance, data, key, data[key], namespace);
    });
};

function _defineReactive(instance, data, key, val, namespace) {
    let scope;
    if (Array.isArray(val)) {
        val.forEach(function(item, i) {
            if (!item || typeof item !== 'object') {
                scope = namespace.concat([key, '[' + i + ']']).reduce((previous, current) =>
                    previous + '.' + current
                );
                (function(num, s) {
                    instance.on(scope + '.change', function(type, value) {
                        val[num] = value;
                        instance.trigger(s)
                    })
                })(i, scope);
            } else
                _observe(instance, item, namespace.concat([key, '[' + i + ']']));
        })
        return
    }
    _observe(instance, val, namespace.concat([key])); // 监听子属性

    scope = namespace.concat(key).reduce((previous, current) =>
        previous + '.' + current
    );

    instance.on(scope + '.change', function(type, value) {
        val = value;
        instance.trigger(scope)
    })

    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        get: function() {
            return val;
        },
        set: function(newVal) {
            val = newVal;
            instance.trigger();
        }
    });
}

function _proxy(scope, data) {
    Object.keys(data).forEach(function(key) {
        _setkey(scope, key);
    });
}

function _setkey(scope, key) {
    var me = scope;
    Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
            return me._data[key];
        },
        set: function proxySetter(newVal) {
            me._data[key] = newVal;
        }
    });
}

let uid = 0;

export default class Monitor extends EventBase {
    constructor({ data = new Object(), render = function() {} }) {
        super();
        let me = this;
        this.monitor_uid = 'monitor-instance-' + ++uid;
        this._data = data;
        this._el = null;
        _observe(this, data);
        _proxy(this, data)
        this._el = render.apply(this);
    }

    get el() {
        if (this._el) return this._el;
        else return (this._el = this.render());
    }

    watch(key, callback) {
        let scope = this.monitor_uid + '.' + key.replace(/([^.])(\[)/ig, "$1.$2");
        callback.bind(this)
        this.on(scope, callback);
        this.trigger(scope);
    }

    $set(key, value) {
        let scope = this.monitor_uid + '.' + key.replace(/([^.])(\[)/ig, "$1.$2") + '.change';
        this.trigger(scope, value);
    }

}