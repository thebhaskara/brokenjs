var _ = require('lodash');
var Callbacks = require('./callbacks');

var Merge = module.exports = function() {
    var init = new Callbacks,
        base = function() {
            init.runWith(this, arguments);
        },
        mergeToPrototype = getMerger(base.prototype),
        mergeToBase = getMerger(base);

    _.each(arguments, function(factory) {
        if (_.isFunction(factory)) {
            init.add(factory);
            _.each(factory.prototype, mergeToPrototype);
            _.each(factory, mergeToBase);
        } else {
            _.each(factory, mergeToPrototype);
        }
    });

    return base;
};

var getMerger = function(base) {
    return function(val, key) {
        var baseVal = base[key];
        if (_.isFunction(baseVal) && _.isFunction(val)) {
            base[key] = function() {
                baseVal.apply(this, arguments);
                return val.apply(this, arguments);
            }
        } else {
            base[key] = val;
        }
    }
}