var _ = require('lodash');
var Callbacks = require('./callbacks');
var Injector = require('./injector');

var Merge = module.exports = function () {
    var whenMergerInit = new Callbacks, whenMergerPropertyBinding = new Callbacks;
    whenMergerPropertyBinding.add(mergeFunctions);
    whenMergerPropertyBinding.add(mergeObjects);
    whenMergerPropertyBinding.add(mergeArrays);
    _.each(arguments, function (arg) {
        if (arg.whenMergerInit) {
            whenMergerInit.add(arg.whenMergerInit);
        } else if (arg.whenMergerPropertyBinding) {
            whenMergerPropertyBinding.add(arg.whenMergerPropertyBinding);
        }
    })
    whenMergerPropertyBinding.add(mergeNonNil);

    var init = new Callbacks,
        base = function () {
            init.runWith(this, arguments);
        },
        mergeToPrototype = getMerger(base.prototype, whenMergerPropertyBinding, init),
        mergeToBase = getMerger(base, whenMergerPropertyBinding, init);

    _.each(arguments, function (factory) {

        whenMergerInit.run(factory, base, init);

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

var getMerger = function (base, whenMergerPropertyBinding, init) {
    return function (val, key) {
        var flags = { isAssigned: false };
        whenMergerPropertyBinding.run(val, key, base, init, flags);
    }
}

var mergeFunctions = function (val, key, base, init, flags) {
    var baseVal = base[key];
    if (baseVal != val && _.isFunction(baseVal) && _.isFunction(val)) {
        console.log(baseVal, val, key);
        base[key] = function () {
            baseVal.apply(this, arguments);
            return val.apply(this, arguments);
        }
        flags.isAssigned = true;
    }
}

var mergeObjects = function (val, key, base, init, flags) {
    var baseVal = base[key];
    if (baseVal != val && _.isPlainObject(val) && _.isPlainObject(baseVal)) {
        base[key] = _.assign({}, baseVal, val);
        flags.isAssigned = true;
    }
}

var mergeArrays = function (val, key, base, init, flags) {
    var baseVal = base[key];
    if (val != baseVal && _.isArray(val) && _.isArray(baseVal)) {
        base[key] = _.concat(baseVal, val);
        flags.isAssigned = true;
    }
}

var mergeNonNil = function (val, key, base, init, flags) {
    // if (!flags.isAssigned) {
    //     base[key] = getNonNil(val, base[key]);
    // }
    // TODO - test this thoroughly
    if(_.isUndefined(base[key]) && !_.isUndefined(val)){
        base[key] = val;
    }
}

// var getNonNil = function () {
//     var res;
//     _.each(arguments, function (arg) {
//         if (!_.isNull(arg) && !_.isUndefined(arg)) {
//             res = arg;
//             return false;
//         }
//     })
//     return res;
// }