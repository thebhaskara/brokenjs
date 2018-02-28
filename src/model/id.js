
var Incrementer = require('../standalone/incrementer');

var id = new Incrementer;

var Id = module.exports = function() {
    this._id = id.next();
    // console.log('Id initiated', this._id)
}