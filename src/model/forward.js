var _ = require('lodash');

/**
 * @feature Forward
 * @description 
 * This class provides the ability to forward values 
 * that are set on source model object to destination model object
 * @example
 * var modelA = new Model();
 * var modelB = new Model();
 * var forwarderObj = new Forwarder();
 * forwarderObj.forward(modelA, 'employee.name', modelB, 'manager.name');
 */
var Forwarder = module.exports = function () { };

/**
 * @function forward
 * @description
 * Forwards value from source to destination<br>
 * @example
 * forwarderObj.forward(modelA, 'employee.name', modelB, 'manager.name');
 * @param {Model} src - source model.
 * @param {String} srcProp - property path from the source.
 * @param {Model} dest - destination model.
 * @param {String} destProp - property path to the destination.
 */
Forwarder.prototype.forward = function (src, srcProp, dest, destProp) {
    var self = this;

    if (!src) src = self;
    if (!dest) dest = self;

    var callback = function (val) {
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

/**
 * @function forwardAll
 * @description
 * Calls forward function for each of the arrays provided in the array<br>
 * @example
 * forwarderObj.forwardAll([
 *      [modelA, 'employee.name', modelB, 'manager.name'],
 *      [modelA, 'department.name', modelB, 'manager.deptName']
 * ]);
 * @param {Array(Array)} list - array of forward inputs(inputs as array) (see example).
 */
Forwarder.prototype.forwardAll = function (list) {
    var self = this;

    return _.map(list, function (options) {
        return self.forward.apply(self, options);
    });
}