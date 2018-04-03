var _ = require('lodash');
var Injector = require('../standalone/injector');

var Wathcher = module.exports = function(attributes, options) {};

Wathcher.prototype.watchAll = function(arr, callback) {
    var self = this;

    var seg = Injector._seggregatePropsAndCallback.apply(self, arguments);
    var fn = Injector.inject.apply(self, arguments);

    return _.map(seg.props, function(prop) {
        return self.watch(prop, fn);
    });
};