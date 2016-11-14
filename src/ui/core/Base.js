import Class from './../../core';
import { EventBase } from './event';
import {
    assign
} from './../../util'

let uid = 0;
export const Base = Class('ui.core.Base', {
    base: EventBase,
    constructor(setting) {
        this.callParent();
        this.setting = assign({}, setting);
        this.uid = uid++;
    }
})