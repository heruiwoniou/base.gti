var agent = navigator.userAgent.toLowerCase();

export const ie = /(msie\s|trident.*rv:)([\w.]+)/i.test(agent);
export const lowie = /(msie\s)([\w.]+)/i.test(agent);
export const opera = (!!opera && opera.version);
export const webkit = (agent.indexOf(' applewebkit/') > -1);
export const mac = (agent.indexOf('macintosh') > -1);
export const gecko = ( navigator.product == 'Gecko' && !webkit && !opera && !ie);