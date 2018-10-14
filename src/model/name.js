var Incrementer = require('../standalone/incrementer');

var nameInc = new Incrementer;
var names = {};

/**
 * @feature Name
 * @description 
 * This feature sets component name as the one provided in the options 
 * or it will assign a unique one when not provided.
 */
var Name = module.exports = function(attributes, options) {
    this.options = options || {};
    var name = (options && options.name) || this.name;
    if (!name) name = 'component-' + nameInc.next();
    else names[name] = true;
    this._name = name;
}