var _ = require('lodash');

var Injector = module.exports = function (attributes, options) {
    var self = this;
    console.log('entered', self._name, self._id, self.getChildComponents);
    // if(_.isArray(self.getChildComponents)){
    //     debugger;
    // }
    _.forIn(self, function (val, key) {
        if (_.isArray(val) && val.length > 1) {
            console.log('started', self._name, self._id, key, val);
            self[key] = self.inject(val);
            console.log('endeed ', self._name, self._id, key, val, self[key], 'done');
        }
    })
};

var emptyCallback = function () { };

Injector.prototype._seggregatePropsAndCallback = function (arr, callback) {
    var self = this;

    // fix the following for comma seperated argumnets and callback
    // catch is that there can be listeners to another component as array
    // setting array
    // if (!_.isArray(arr)) {
    //     arr = _.map(arguments);
    //     callback = null;
    // }

    // setting callback
    // arr = _.clone(arr);
    if (!callback) {
        callback = arr[arr.length - 1];
        arr = arr.slice(0, arr.length - 1);
    }
    if (_.isString(callback)) callback = self[callback];
    // if (!callback) callback = emptyCallback;

    return { props: arr, callback: callback };
};

Injector.prototype.inject = function (arr, callback) {
    var self = this;

    var seg = self._seggregatePropsAndCallback.apply(self, arguments);

    if (!seg.callback) {
        // debugger;
    }

    var injectingCallback = function () {
        var values = _.map(seg.props, function (prop) { return self.get(prop); });
        // null check not done 
        // as it is pointless to do this if there is no callback.
        // if (!seg.callback) {
        //     debugger;
        // }
        seg.callback.apply(self, _.concat(values, arguments));
    }

    return injectingCallback;
};