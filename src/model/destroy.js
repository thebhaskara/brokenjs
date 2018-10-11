
var Callbacks = require('../standalone/callbacks');

/**
 * @class Destroy
 * @description 
 * This class adds the ability to destroy object properly.<br>
 * This provides onDestroy(Callbacks) property internally.
 * onDestroy callbacks are run on the destroy function call.<br>
 * This is designed to be used to destory object when needed, 
 * thus preventing memory leaks
 * @example
 * var destoryableObj = new Destory();
 * destoryableObj.destroy();
 */
var Destroy = module.exports = function() {
    this.onDestroy = new Callbacks;
};

/**
 * Calls onDestroy callbacks and then deletes onDestroy object
 * @example
 * destoryableObj.destroy();
 */
Destroy.prototype.destroy = function() {
    this.onDestroy.run();
    delete this.onDestroy;
}