import Class from './../../core';
import { EventBase } from './event';
import {
    assign
} from './../../util'

let uid = 0;
export const Base = Class('ui.core.Base', {
    base: EventBase,
    constructor(data) {
        this.callParent();
        this.data = assign({}, data);
        this.uid = uid++;
    }
})