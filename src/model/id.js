
var Incrementer = require('../standalone/incrementer');

var id = new Incrementer;

/**
 * @feature Id
 * @description 
 * This feature sets a unique number as id in the _id property of its instance.
 */
var Id = module.exports = function() {
    this._id = id.next();
}