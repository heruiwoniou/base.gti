import Class from './../../core';
import { Base } from './Base';

export const ElBase = Class('ui.core.ElBase', {
    base: Base,
    constructor(element, setting) {
        this.callParent(setting);
        this.el = element;
    },
    initialize() {
        this.el.setAttribute('uid', this.uid);
    }
})