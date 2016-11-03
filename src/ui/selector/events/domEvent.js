export function EventType(type) {
    type = type.split('.');
    type[0] = type[0].toLowerCase();
    this.type = type[0];
    this.group = type.length > 1 ? type[1] : null;
    this.fulltype = type.join('.');
}

const typereg = /^(\s*[^\.\s]+\.[^\.\s]+|\s*[^\.\s]+)*$/i;

EventType.prototype.create = function(listener) {
    return this.group ? {
        group: this.group,
        listener: listener
    } : listener;
}

EventType.validate = function(type) {
    return typereg.test(type);
}

/**
 * 根据type 获取 dom对象上的事件列表
 * 
 * @param {any} element
 * @param {any} type
 * @param {any} force
 * @param {any} selector
 * @returns
 */
export function getListener(element, eventtype, force, selector) {
    var allListeners = (element.__allListeners || force && (element.__allListeners = {}));
    var { type } = new EventType(eventtype);
    if (!allListeners[type] && force) {
        allListeners[type] = {
            //用于在DOM事件通知虚拟事件
            __bind__(e) {
                return selector.trigger(type, e || window.event);
            },
            __base__: []
        };
        addHandler(element, type, allListeners[type].__bind__);
    }
    if (!allListeners || !allListeners[type]) { return []; }
    return allListeners[type].__base__;
}

/**
 * 移除 dom 上的事件
 * 
 * @export
 * @param {any} element
 * @param {any} type
 */
export function removeListener(element, type) {
    var allListeners = element.__allListeners;
    var eventType = new EventType(type);
    if (allListeners && allListeners[eventType.type]) {
        removeHandler(element, eventType.type, allListeners[eventType.type].__bind__);
        delete allListeners[eventType.type];
    }
}

export function addHandler(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, handler);
    } else {
        element['on' + type] = handler;
    }
}
export function removeHandler(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + type, handler);
    } else {
        element['on' + type] = null;
    }
}