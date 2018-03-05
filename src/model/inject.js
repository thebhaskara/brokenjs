var _ = require('lodash');

var Injector = module.exports = function(attributes, options) {
    var self = this;
    _.forIn(self, function(val, key) {
        if (_.isArray(val)) {
            self[key] = self.inject(val);
        }
    })
};

var emptyCallback = function() {};

Injector.prototype._seggregatePropsAndCallback = function(arr, callback) {
    var self = this;
    
    // fix the following for comma seperated argumnets and callback
    // catch is that there can be listeners to another component as array
    // setting array
    // if (!_.isArray(arr)) {
    //     arr = _.map(arguments);
    //     callback = null;
    // }

    // setting callback
    if (!callback) callback = arr.pop();
    if (_.isString(callback)) callback = self[callback];
    // if (!callback) callback = emptyCallback;

    return { props: arr, callback: callback };
};

Injector.prototype.inject = function(arr, callback) {
    var self = this;

    var seg = self._seggregatePropsAndCallback.apply(self, arguments);

    var injectingCallback = function() {
        var values = _.map(seg.props, function(prop) { return self.get(prop); });
        // null check not done 
        // as it is pointless to do this if there is no callback.
        seg.callback.apply(self, _.concat(values, arguments));
    }

    return injectingCallback;
};