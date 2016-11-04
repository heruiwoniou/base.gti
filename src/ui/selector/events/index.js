import {
    EventType,
    getListener,
    removeListener
} from './domEvent';

import {
    isObject,
    isFunction,
    trim
} from '../../../util'

export default {
    addListener: function(types, listener) {
        if (!EventType.validate(types)) { return this; }
        types = trim(types).split(/\s+/);
        return this.each((el, index) => {
            var i = 0,
                ti;
            for (; ti = types[i++];) {
                var eventType = new EventType(ti);
                getListener(el, ti, true, this.slice(index, index + 1)).push(eventType.create(listener));
            }
        })
    },
    on: function(types, listener) {
        return this.addListener(types, listener);
    },
    removeListener: function(types, listener) {
        if (!EventType.validate(types)) { return this; }
        types = trim(types).split(/\s+/);
        return this.each(el => {
            for (var i = 0, ti; ti = types[i++];) {
                var eventType = new EventType(ti);
                var array = getListener(el, ti) || [],
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

                if (array.length == 0) { removeListener(el, ti);　 }
            }
        })
    },
    off: function(types, listener) {
        return this.removeListener(types, listener)
    },
    fireEvent: function(types, ...arg) {
        if (!EventType.validate(types)) { return false; }
        var result = true;
        types = trim(types).split(' ');
        this.each(el => {
            for (var i = 0, ti; ti = types[i++];) {
                var listeners = getListener(el, ti),
                    eventType = new EventType(ti),
                    r, start, total, listener, item;
                if (listeners) {
                    start = 0;
                    total = listeners.length;
                    for (; start < total; start++) {
                        item = listeners[start];
                        if (!item) { continue; }
                        listener = isFunction(item) ? item : item.listener;
                        if (eventType.group && item.group !== eventType.group) { continue; }
                        r = listener.call(el, ...arg);
                        if (r === false) {
                            result = false;
                            return;
                        }
                    }
                }
            }
        })
        return result;
    },
    trigger: function() {
        return this.fireEvent.apply(this, arguments);
    }
}