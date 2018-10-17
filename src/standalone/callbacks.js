var _ = require('lodash');

/**
 * @class Callbacks
 * @description 
 * Callbacks is structure that can handle registering callbacks from multiple places and then trigger from one place.
 * @example
 * function fn1( value ) {
 * console.log( value );
 * }
 * 
 * function fn2( value ) {
 * console.log( "fn2 says: " + value );
 * return false;
 * }
 * 
 * let callbacks = new Callbacks();
 * callbacks.add(fn1);
 * // Outputs: foo!
 * callbacks.run( "foo!" );
 * 
 * callbacks.add(fn2);
 * // Outputs: bar!, fn2 says: bar!
 * callbacks.run( "bar!" );
 */
var Callbacks = module.exports = function () {
    this.callbacks = {};
}

/**
 * @function add
 * @description 
 * Adds a callback to the list.
 * @param {Function} callback - callback function to be added
 * @example
 * callbacks.add(function(){ 
 * // added function
 * });
 */
Callbacks.prototype.add = function (callback) {
    this.callbacks[callback] = callback;
    return callback;
};

/**
 * @function addWithKey
 * @description 
 * Adds a callback to the list by key.
 * @param {String} key - key to refer the callback
 * @param {Function} callback - callback function to be added
 * @example
 * callbacks.addWithKey('key1', function(){ 
 * // added function
 * });
 */
Callbacks.prototype.addWithKey = function (key, callback) {
    this.callbacks[key] = callback;
};

/**
 * @function remove
 * @description 
 * removes callback from the list.
 * @param {Function|String} callback|key - key or callback to be removed from the list
 * @example
 * callbacks.remove(fn1);
 * callbacks.remove('key1');
 */
Callbacks.prototype.remove = function (callback) {
    delete this.callbacks[callback];
    return this;
}

/**
 * @function run
 * @description 
 * removes callback from the list.
 * @param {arguments} arguments - set of arguments to be passed to the callbacks
 * @example
 * callbacks.run('v1', 'v2');
 */
Callbacks.prototype.run = function () {
    if (this.disabled) return;
    var args = arguments;
    _.each(this.callbacks, function (callback) {
        callback.apply(this, args);
    });
}

/**
 * @function runWith
 * @description 
 * removes callback from the list.
 * @param {Object} context - context to set while running callbacks
 * @param {Array} args - arguments as an array to pass to the callbacks
 * @example
 * callbacks.runWith({ a: 10 }, [ 20, 30 ]);
 */
Callbacks.prototype.runWith = function (context, args) {
    if (this.disabled) return;
    _.each(this.callbacks, function (callback) {
        callback.apply(context, args);
    });
}

/**
 * @function disable
 * @description 
 * Disables the callbacks. Once disabled, run can't trigger callbacks.
 * @example
 * callbacks.disable();
 */
Callbacks.prototype.disable = function () {
    this.disabled = true;
}

/**
 * @function enable
 * @description 
 * Enables the callbacks. Once enabled, run can trigger callbacks. Callbacks is enabled when initialized.
 * @example
 * callbacks.enable();
 */
Callbacks.prototype.enable = function () {
    this.disabled = false;
}