import Class from './../../core';
import {
    trim,
    isObject,
    isFunction
} from '../../util';

export const Event = Class('ui.core.Event', {
    constructor() {
        this.__allListeners = {};
    },
    on(type, listener) {

    }
})