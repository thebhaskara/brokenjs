
var Callbacks = require('../standalone/callbacks');

/**
 * @feature Destroy
 * @description 
 * This feature adds the ability to call the appropriate callbacks before destorying the instance.<br>
 * This provides onDestroy(Callbacks) property in the instance.<br>
 * This is designed to be used to do necessary actions before destorying, 
 * such as preventing memory leaks, unwatching, detaching events, etc...
 */
var Destroy = module.exports = function () {
    this.onDestroy = new Callbacks;
};

/**
 * @function destroy
 * @description
 * Calls onDestroy callbacks and then deletes onDestroy object
 * @example
 * var destoryableObj = new Destory();
 * destoryableObj.onDestroy.add(() => console.log('called on destroy'));
 * destoryableObj.destroy(); // logs 'called on destroy' on console
 * @param
 * empty
 */
Destroy.prototype.destroy = function () {
    this.onDestroy.run();
    delete this.onDestroy;
}