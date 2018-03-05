var _ = require('lodash');
var Injector = require('./inject');

var Wathcher = module.exports = function(attributes, options) {};

Wathcher.prototype.watchAll = function(arr, callback) {
    var self = this;

    var seg = Injector.prototype._seggregatePropsAndCallback.apply(self, arguments);
    var fn = Injector.prototype.inject.apply(self, arguments);

    return _.map(seg.props, function(prop) {
        return self.watch(prop, fn);
    });
};