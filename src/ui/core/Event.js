import Class from './../../core';
export const Event = Class('ui.core.Event', {
    constructor() {
        this.__allListeners = {};
    }
})