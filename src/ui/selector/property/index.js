import {
    isObject,
    isString
} from '../../../util';

export default {
    attr(props) {
        if (isObject(props)) {
            var prop;
            return this.each(el => {
                for (prop in props) {
                    el.setAttribute(prop, props[prop]);
                }
            })
        } else if (isString(props)) {
            return this[0].getAttribute(props);
        }
        return this;
    }
}