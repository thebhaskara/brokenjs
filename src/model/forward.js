var _ = require('lodash');

var Forwarder = module.exports = function(attributes, options) {};

var emptyCallback = function() {};

Forwarder.prototype.forward = function(src, srcProp, dest, destProp) {
    var self = this;

    if (!src) src = self;
    if (!dest) dest = self;

    var callback = function(val) {
        // do something to prevent infinite loop
        if (destProp) {
            dest.set(destProp, val);
        } else {
            dest.set(val);
        }
    }

    var watchId = srcProp ? src.watch(srcProp, callback) : src.watch(callback);
    if (src != self) {
        self._externalWatches[watchId] = component;
    }
    return watchId;
};

Forwarder.prototype.forwardAll = function(list) {
    var self = this;

    return _.map(list, function(options){
        return self.forward.apply(self, options);
    });
}