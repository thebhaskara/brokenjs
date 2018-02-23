var Incrementer = require('../standalone/incrementer');

var name = new Incrementer;
var names = {};

var Name = module.exports = function(attributes, options) {
    if (!options.name) options.name = 'component-' + name.next();
    if (names[options.name]) throw ["name", options.name, "already", "exists"].join(' ');
    else names[options.name] = true;
    this._name = options.name;
}