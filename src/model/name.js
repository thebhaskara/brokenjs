var Incrementer = require('../standalone/incrementer');

var nameInc = new Incrementer;
var names = {};

var Name = module.exports = function(attributes, options) {
    this.options = options || {};
    var name = (options && options.name) || this.name;
    if (!name) name = 'component-' + nameInc.next();
    // crap! figure out how to do the name thing
    // if (names[name]) throw ["name", name, "already", "exists"].join(' ');
    else names[name] = true;
    this._name = name;
}