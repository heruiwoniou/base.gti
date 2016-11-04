import {
    isObject,
    isString,
    propFormat
} from './../../../util'

export default {
    css(props) {
        if (isObject(props)) {
            return this.each(el => {
                for (var prop in props) {
                    el.style[propFormat(prop)] = props[prop]
                }
            });
        } else if (isString(props)) {
            return this[0].style[propFormat(props)];
        }
        return this;
    }
}