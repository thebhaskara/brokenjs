
var Callbacks = require('../standalone/callbacks');

var Destroy = module.exports = function() {
    this.onDestroy = new Callbacks;
};

Destroy.prototype.destroy = function() {
    this.onDestroy.run();
    delete this.onDestroy;
}