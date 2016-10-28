import Class from './../../core';
import { Event } from './Event';
import {
    assign
} from './../../util'

let uid = 0;
export const Base = Class('ui.core.Base', {
    base: Event,
    constructor(setting) {
        this.setting = assign({}, setting);
        this.uid = uid++;
    }
})