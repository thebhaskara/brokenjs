var _ = require('lodash');

var Callbacks = module.exports = function() {
    this.callbacks = {};
}

Callbacks.prototype.add = function(callback) {
    this.callbacks[callback] = callback;
    return callback;
};

Callbacks.prototype.addWithKey = function(key, callback) {
    this.callbacks[key] = callback;
};

Callbacks.prototype.remove = function(callback) {
    delete this.callbacks[callback];
    return this;
}

Callbacks.prototype.run = function() {
    if (this.disabled) return;
    var args = arguments;
    _.each(this.callbacks, function(callback) {
        callback.apply(this, args);
    });
}

Callbacks.prototype.runWith = function(context, args) {
    if (this.disabled) return;
    _.each(this.callbacks, function(callback) {
        callback.apply(context, args);
    });
}

Callbacks.prototype.disable = function() {
    this.disabled = true;
}

Callbacks.prototype.enable = function() {
    this.disabled = false;
}