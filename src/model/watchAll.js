var _ = require('lodash');
var Injector = require('../standalone/injector');

/**
 * @feature WathcherAll
 * @description 
 * This feature adds the ability to listen to a list of paths
 */
var Wathcher = module.exports = function(attributes, options) {};

/**
 * @function watchAll
 * @description 
 * watches all the paths provided and passes the values of those paths to the callback 
 * everytime a set is triggered on any of those paths.
 * @param {String} path - first path.
 * @param ...{String} [path] - any number of paths. 
 * @param {Function} callback - callback to be triggered. 
 * @example
 * watcherObj.watchAll('path1', 'path2', 'path3', function(path1Value, path2Value, path3Value){
 * // can provide any number of paths
 * })
 */
Wathcher.prototype.watchAll = function(arr, callback) {
    var self = this;

    var seg = Injector._seggregatePropsAndCallback.apply(self, arguments);
    var fn = Injector.inject.apply(self, arguments);

    return _.map(seg.props, function(prop) {
        return self.watch(prop, fn);
    });
};