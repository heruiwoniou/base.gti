import Class from '../../../core'
import { isFunction, isArray } from '../../../util'
var PENDING = undefined,
    FULFILLED = 1,
    REJECTED = 2;
var isThenable = function(obj) {
    return obj && typeof obj['then'] == 'function';
}

var transition = function(status, value) {
    var promise = this;
    if (promise._status !== PENDING)
        return;
    setTimeout(function() {
        promise._status = status;
        publish.call(promise, value);
    });
}
var publish = function(val) {
    var promise = this,
        fn,
        st = promise._status === FULFILLED,
        queue = promise[st ?
            '_resolves' :
            '_rejects'];

    while (fn = queue.shift()) {
        val = fn.call(promise, val) || val;
    }
    promise[st ?
        '_value' :
        '_reason'] = val;
    promise['_resolves'] = promise['_rejects'] = undefined;
}

export const Promise = Class('ui.core.Promise', {
    constructor(resolver) {
        if (!isFunction(resolver))
            throw new TypeError('You must pass a resolver function as the first argument to the promise construct' +
                'or');
        if (!(this instanceof Promise))
            return new Promise(resolver);

        var promise = this;
        promise._value;
        promise._reason;
        promise._status = PENDING;
        promise._resolves = [];
        promise._rejects = [];

        var resolve = function(value) {
            transition.apply(promise, [FULFILLED].concat([value]));
            //状态转换为FULFILLED 执行then时保存到_resolves里的回调， 如果回调有返回值，更新当前_value
        }
        var reject = function(reason) {
            transition.apply(promise, [REJECTED].concat([reason]));
            //状态转换为REJECTED 执行then时保存到_rejects里的回调， 如果回调有返回值，更新当前_rejects
        }

        resolver(resolve, reject);
    },
    then(onFulfilled, onRejected) {
        var promise = this;
        // 每次返回一个promise，保证是可thenable的
        return new Promise(function(resolve, reject) {
            function callback(value) {
                var ret = isFunction(onFulfilled) && onFulfilled(value) || value;
                if (isThenable(ret)) {
                    // 根据返回的promise执行的结果，触发下一个promise相应的状态
                    ret
                        .then(function(value) {
                            resolve(value);
                        }, function(reason) {
                            reject(reason);
                        });
                } else {
                    resolve(ret);
                }
            }

            function errback(reason) {
                reason = isFunction(onRejected) && onRejected(reason) || reason;
                reject(reason);
            }
            if (promise._status === PENDING) {
                promise
                    ._resolves
                    .push(callback);
                promise
                    ._rejects
                    .push(errback);
            } else if (promise._status === FULFILLED) { // 状态改变后的then操作，立刻执行
                callback(promise._value);
            } else if (promise._status === REJECTED) {
                errback(promise._reason);
            }
        });
    },
    catch (onRejected) {
        return this.then(undefined, onRejected)
    },
    statics: {
        all(promises) {
            if (!isArray(promises)) {
                throw new TypeError('You must pass an array to all.');
            }
            return new Promise(function(resolve, reject) {
                var i = 0,
                    result = [],
                    len = promises.length,
                    count = len

                function resolver(index) {
                    return function(value) {
                        resolveAll(index, value);
                    };
                }

                function rejecter(reason) {
                    reject(reason);
                }

                function resolveAll(index, value) {
                    result[index] = value;
                    if (--count == 0) {
                        resolve(result)
                    }
                }

                for (; i < len; i++) {
                    promises[i].then(resolver(i), rejecter);
                }
            });
        }
    }
})