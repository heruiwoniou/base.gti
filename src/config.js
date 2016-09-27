export const EDITOR = window.EDITOR = {
    instances: {},
    version: '1.0.0'
}
var agent = navigator.userAgent.toLowerCase();
export const ie = /(msie\s|trident.*rv:)([\w.]+)/i.test(agent);
export const lowie = /(msie\s)([\w.]+)/i.test(agent);