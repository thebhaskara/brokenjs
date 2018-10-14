var _ = require('lodash');

/**
 * @feature Injector
 * @description 
 * This feature adds the ability to pass values at paths into a given function.
 * @example
 * ['path1', 'path2', function(path1Value, path2Value){
 *     // your code here
 * }]
 * @param
 * none
 */
var Injector = module.exports = function () { };

var emptyCallback = function () { };

Injector._seggregatePropsAndCallback = function (component, arr, callback) {

    if (!callback) {
        callback = arr[arr.length - 1];
        arr = arr.slice(0, arr.length - 1);
    }

    if (_.isString(callback)) callback = component[callback];

    return { props: arr, callback: callback };
};

Injector.inject = function (arr, callback) {
    var component = this;

    var seg = Injector._seggregatePropsAndCallback(component, arr, callback);

    var injectingCallback = function () {
        var values = _.map(seg.props, function (prop) { return component.get(prop); });
        return seg.callback.apply(component, _.concat(values, arguments));
    }

    return injectingCallback;
};

Injector.bindInject = function (component) {
    _.forIn(component, function (val, key) {
        component[key] = Injector.getInjectCallback(val, key);
    })
};

Injector.whenMergerPropertyBinding = function (val, key, base, init, flags) {

    if (_.isArray(val) && val.length > 1) {
        var prop = "_injected_key_" + key + "_val_" + val;
        base[key] = function () {
            var callback = this[prop];
            if (!callback) {
                callback = this[prop] = Injector.inject.call(this, val);
            }
            return callback.apply(this, arguments);
        }
        flags.isAssigned = true;
    }
}