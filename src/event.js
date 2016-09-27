import $ from 'jquery';

let getListener = function(obj, type, force) {
    var allListeners;
    type = type.toLowerCase();
    return ((allListeners = (obj.__allListeners || force && (obj.__allListeners = {}))) &&
        (allListeners[type] || force && (allListeners[type] = [])));
}

let removeItem = function(array, item) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] === item) {
            array.splice(i, 1);
            i--;
        }
    }
}

export default class Event {
    constructor() {}

    addListener(types, listener) {
        types = $.trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            getListener(this, ti, true).push(listener);
        }
    }
    on(types, listener) {
        return this.addListener(types, listener);
    }

    off(types, listener) {
        return this.removeListener(types, listener)
    }

    trigger() {
        return this.fireEvent.apply(this, arguments);
    }

    removeListener(types, listener) {
        types = $.trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            removeItem(getListener(this, ti) || [], listener);
        }
    }

    fireEvent() {
        var types = arguments[0];
        types = $.trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            var listeners = getListener(this, ti),
                r, t, k;
            if (listeners) {
                k = listeners.length;
                while (k--) {
                    if (!listeners[k]) continue;
                    t = listeners[k].apply(this, arguments);
                    if (t === true) {
                        return t;
                    }
                    if (t !== undefined) {
                        r = t;
                    }
                }
            }
            if (t = this['on' + ti.toLowerCase()]) {
                r = t.apply(this, arguments);
            }
        }
        return r;
    }

}