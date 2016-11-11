import Class from './../../core'

const full = /^(\s*[^\.\s]+\.[^\.\s]+|\s*[^\.\s]+)*$/i;
const half = /^(\s*[^\.\s]+\.[^\.\s]+|\s*[^\.\s]+|\s*\.[^\.\s]+)*$/i;

const type_group = /^[^\.\s]+\.[^\.\s]+$/i;
const type = /^[^\.\s]+$/i;
const group = /^\.[^\.\s]+$/i;

export default Class('ui.core.EventFactory', {
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
    statics: {
        isFull(type) {
            return full.test(type)
        },
        isHalf(type) {
            return half.test(type)
        },
        isTypeGroup(type) {
            return type_group.test(type);
        },
        isType(type) {
            return type.test(type);
        },
        isGroup(type) {
            return group.test(type);
        }
    }
})