import {
    isObject,
    isFunction,
    trim
} from '../../../util';
import { EventFactory } from './EventFactory';

function allscope(instance, event_string) {
    var result = [];
    var scopes = instance.__allListeners;
    var et = new EventFactory(event_string);
    if (et.isTypeGroup() || et.isType()) result.push(et.type);
    if (et.isGroup())
        for (var key in scopes) result.push(key);
    return result;
}

function getListener(instance, type_string, force) {
    var allListeners = instance.__allListeners;
    var et = new EventFactory(type_string);
    if (!allListeners[et.type] && force) {
        allListeners[et.type] = {
            __base__: []
        }
    };
    return !allListeners[et.type] ? [] : allListeners[et.type].__base__;
}

function removeListener(instance, type) {
    var allListeners = instance.__allListeners;
    var et = new EventFactory(type);
    if (allListeners && allListeners[et.type]) {
        delete allListeners[et.type];
    }
}

export default {
    on(types, listener) { return this.addListener(types, listener); },
    addListener(types, listener) {
        if (!EventFactory.isFull(types)) { return this; }
        types = trim(types).split(/\s+/);
        var i = 0,
            ti;
        for (; ti = types[i++];) {
            var et = new EventFactory(ti);
            getListener(this, ti, true).push(et.create(listener));
        }

    },
    off(types, listener) { return this.removeListener(types, listener); },
    removeListener(types, listener) {
        if (!EventFactory.isHalf(types)) { return this; }
        types = trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            var scope = allscope(this, ti),
                key;
            for (key = 0; key < scope.length; key++) {
                var eventType = new EventFactory(ti);
                var currentTi = eventType.isGroup() ? scope[key] + '.' + ti : ti;
                var array = getListener(this, currentTi) || [],
                    item = listener,
                    l, target;
                if (eventType.group) {
                    for (l = array.length - 1; l >= 0; l--) {
                        target = array[l];
                        if (isObject(target) && target.group == eventType.group) {
                            if (item && target.listener === item || !item) {
                                array.splice(l, 1);
                            }
                        }
                    }
                } else {
                    for (l = array.length - 1; l >= 0; l--) {
                        target = array[l];
                        if (isObject(target)) {
                            if (item && target.listener === item || !item) {
                                array.splice(l, 1);
                            }
                        } else if (isFunction(target)) {
                            if (item && array[l] === item || !item) {
                                array.splice(l, 1);
                            }
                        }
                    }
                }
                if (array.length == 0) { removeListener(this, currentTi);　 }
            }
        }
        return this;
    },
    fireEvent(types, ...arg) {
        if (!EventFactory.isHalf(types)) { return false; }
        types = trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            var listeners = getListener(this, ti),
                eventType = new EventFactory(ti),
                r, start, total, listener, item;
            if (listeners) {
                start = 0;
                total = listeners.length;
                for (; start < total; start++) {
                    item = listeners[start];
                    if (!item) { continue; }
                    listener = isFunction(item) ? item : item.listener;
                    if (eventType.group && item.group !== eventType.group) { continue; }
                    r = listener.call(this, ...arg);
                    if (r === false) {
                        return false;
                    }
                }
            }
        }
    },
    trigger() { return this.fireEvent.apply(this, arguments) }
};