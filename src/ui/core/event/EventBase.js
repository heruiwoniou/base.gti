import Class from '../../../core';
import handler from './handler';

export const EventBase = Class('ui.core.event.EventBase', {
    constructor() {
        this.__allListeners = {};
    }
})

EventBase.use(handler);