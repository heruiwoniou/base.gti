export function EventType(type) {
    type = type.split('.');
    type[0] = type[0].toLowerCase();
    this.type = type[0];
    this.group = type.length > 1 ? type[1] : null;
    this.fulltype = type.join('.');
}

EventType.prototype.create = function(listener) {
    return this.group ? {
        group: this.group,
        listener: listener
    } : listener;
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
    var { type, fulltype } = new EventType(eventtype)
    if (!allListeners[type] && force) {
        allListeners[type] = {
            //用于在DOM事件通知虚拟事件
            __bind__(e) {
                return selector.trigger(fulltype, e || window.event);
            },
            __base__: []
        };
        addHandler(element, type, allListeners[type].__bind__);
    }
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
    type = type.toLowerCase();
    removeHandler(element, type, allListeners[type].__bind__);
    delete allListeners[type];
}

export function addHandler(element, type, handler) {
    if (element.addEventListner) {
        element.addEventListner(type, handler, false);
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