import { assign } from '../../../util'

const complete = function(type, result) {
    var ret;
    setTimeout(() => {
        while (this.callbacks[0]) {
            ret = this.callbacks.shift()[type](ret || result);
        }
    });
}

export function Promise(instance) {
    this.callbacks = [];
}

Promise.prototype.resolve = function(result) {
    (complete.bind(this))("resolve", result);
};

Promise.prototype.reject = function(result) {
    (complete.bind(this))("reject", result);
};

Promise.prototype.then = function(successHandler, failedHandler) {
    this.callbacks.push({
        resolve: successHandler,
        reject: failedHandler
    });

    return this;
};

Promise.prototype.promise = function(instance) {
    return assign(instance, this);
}