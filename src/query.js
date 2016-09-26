let splice = Array.prototype.splice;

function Query(selector) {
    this.length = 0;
    var els = selector.nodeName ? selector : document.querySelectorAll(selector);
    Array.apply(this);
    splice.call(this, 0, 0, els);
}

Query.prototype = {
    constructor: Query,
    extend: function() {}
}

export default function Q(selector) {
    return new Query(selector);
}