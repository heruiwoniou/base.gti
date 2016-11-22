import Class from './../../../core'

const _full = /^(\s*[^\.\s]+\.[^\.\s]+|\s*[^\.\s]+)*$/i;
const _half = /^(\s*[^\.\s]+\.[^\.\s]+|\s*[^\.\s]+|\s*\.[^\.\s]+)*$/i;

const _type_group = /^[^\.\s]+\.[^\.\s]+$/i;
const _type = /^[^\.\s]+$/i;
const _group = /^\.[^\.\s]+$/i;

export const EventFactory = Class('ui.core.event.EventFactory', {
    constructor(type) {
        type = type.split('.');
        type[0] = type[0].toLowerCase();
        this.type = type[0];
        this.group = type.length > 1 ? type[1] : null;
        this.fulltype = type.join('.')
    },
    create(listener) {
        return this.group ? {
            group: this.group,
            listener: listener
        } : listener
    },
    isTypeGroup() {
        return EventFactory.isTypeGroup(this.fulltype);
    },
    isType(type) {
        return EventFactory.isType(this.fulltype);
    },
    isGroup(type) {
        return EventFactory.isGroup(this.fulltype);
    },
    statics: {
        isFull(type) {
            return _full.test(type)
        },
        isHalf(type) {
            return _half.test(type)
        },
        isTypeGroup(type) {
            return _type_group.test(type);
        },
        isType(type) {
            return _type.test(type);
        },
        isGroup(type) {
            return _group.test(type);
        }
    }
})