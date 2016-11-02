import {
    EventType,
    getListener,
    removeListener
} from './domEvent';


export default {
    addListener: function(types, listener) {
        types = types.trim().split(/\s+/);
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
        types = types.trim().split(/\s+/);
        return this.each(el => {
            for (var i = 0, ti; ti = types[i++];) {
                var array = getListener(el, ti) || [],
                    item = listener
                for (var l = array.length - 1; l >= 0; l--) {
                    if (item && array[l] === item || !item) {
                        array.splice(l, 1);
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
        var result = true;
        types = types.trim().split(' ');
        this.each(el => {
            for (var i = 0, ti; ti = types[i++];) {
                var listeners = getListener(el, ti),
                    r, k;
                if (listeners) {
                    k = listeners.length;
                    var start = -1;
                    while (++start < k) {
                        if (!listeners[start]) { continue; }
                        r = listeners[start].call(this, ...arg);
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