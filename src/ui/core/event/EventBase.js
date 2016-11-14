import Class from '../../../core';
import { EventFactory } from './EventFactory';
import handler from './handler';

export const EventBase = Class('ui.core.Event', {
    constructor() {
        this.__allListeners = {};
    }
})

EventBase.use(handler);