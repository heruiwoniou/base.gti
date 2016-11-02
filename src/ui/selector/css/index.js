import {
    isObject,
    isString
} from './../../../util'

export default {
    css(setting) {
        return this.each(el => {
            if (isObject(setting)) {
                //console.log(setting)
                for (var prop in setting) {
                    el.style[prop] = setting[prop]
                }
            } else if (isString(setting)) {
                console.log(setting)

            }
        });
    }
}
/**
 * $(selector).css({a:'b'});
 * $(selector).css("width")
 * 
 */