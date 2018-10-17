var _ = require('lodash');
var Incrementer = require('../standalone/incrementer');

/**
 * @feature Watcher
 * @description 
 * This feature adds the ability to listen to one path at a time.
 * This works only if Attributes feature is included.
 */
var Watcher = module.exports = function (attributes, options) {
    var self = this;

    self._watches = (options && options.watches) || {};
    self._externalWatches = (options && options.externalWatches) || {};
    attributes && executeWatches(self, self._watches);

    var initWatches = (options && options.initWatches) || self.initWatches;
    if (initWatches) {
        // setTimeout(function () {
        _.each(initWatches, function (fn, key) {
            self.watch(key, fn);
        })
        // })
    }
};

var trigger = function (component, path) {
    var watches = [],
        parentPaths = [];

    if (!path) {
        watches = component._watches;
    } else {

        // generating a list of possible parents.
        var split = path && path.split('.') || ['ya'];
        split.pop();
        var len = split.length
        for (var i = 0; i < len; i++) {
            parentPaths.push(split.join('.'));
            split.pop();
        }

        _.each(component._watches, function (watch) {
            if (!watch.path && watch.path == path || _.startsWith(watch.path, path)) {
                watches.push(watch);
            } else if (parentPaths.length > 0 && _.find(parentPaths, function (p) { return p == watch.path })) {
                watches.push(watch);
            }
        })
    }

    executeWatches(component, watches);
}

var executeWatches = function (component, watches) {
    _.each(watches, function (watch) {
        var value = component.get(watch.path);
        var callback = watch.callback;
        if (_.isString(callback)) {
            callback = component[callback];
        }
        if (_.isFunction(callback)) {
            callback.call(component, value);
        }
    });
}

var watchesInc = new Incrementer;

/**
 * @function watch
 * @description 
 * watches all the paths provided and passes the values of those paths to the callback 
 * everytime a set is triggered on any of those paths.
 * @param {Watcher|Model|ViewModel} [component] - source component to watch, if not provided, watches itself.
 * @param {String} path - attribute's path. 
 * @param {Function} callback - callback to be triggered. 
 * @returns {Number} - watches Id, which can be used to kill this watch;
 * @example
 * watcherObj.watch('path', function(pathValue){
 * // your code here
 * })
 */
Watcher.prototype.watch = function (component, path, callback) {

    var len = arguments.length,
        watchId;
    if (len < 2 || len > 3) {
        throw "invalid arguments";
    } else if (arguments.length == 2) {
        return this.watch(this, component, path);
    } else if (!component || !component.watch) {
        throw "watch is not available";
    } else {
        // callback = callback.bind(component);

        if (component == this) {
            watchId = watchesInc.next();
            this._watches[watchId] = {
                path: path,
                callback: callback
            };
        } else {
            watchId = component.watch(path, callback);
            this._externalWatches[watchId] = component;
        }
        var value = component.get(path);
        if (!_.isUndefined(value)) {
            // callback.call(component, value);
            executeWatches(component, [component._watches[watchId]]);
        }
        return watchId;
    }
}

/**
 * @function unwatch
 * @description 
 * unwatches a watch.
 * @param {Number} watchId - Id of the watch to be unwatched.
 * @example
 * let watchId = watcherObj.watch('path1', (path1Value) => console.log(path1Value));
 * watcherObj.set('path1', 10); // prints 10 on console.
 * watcherObj.unwatch(watchId);
 * watcherObj.set('path1', 10); // does not print 10 on console.
 */
Watcher.prototype.unwatch = function (watchId) {
    var self = this;
    if (_.isArray(watchId)) {
        _.each(watchId, function (id) {
            self.unwatch(id);
        });
    } else {
        delete self._watches[watchId];
        if (self._externalWatches[watchId]) {
            var component = self._externalWatches[watchId];
            if (component && component.unwatch) {
                component.unwatch(watchId);
            }
        }
    }
}

/**
 * @function set
 * @description 
 * triggers a watch.
 * @param {String} [path] - Path to be triggered
 * @example
 * let watchId = watcherObj.watch('path1', (path1Value) => console.log(path1Value));
 * watcherObj.set('path1', 10); // prints 10 on console.
 * watcherObj.unwatch(watchId);
 * watcherObj.set('path1', 10); // does not print 10 on console.
 */
Watcher.prototype.set = function (path, value) {
    if (arguments.length == 1) {
        trigger(this);
    } else {
        trigger(this, path);
    }
    return this;
}

/**
 * @function destroy
 * @description 
 * unwatches all external watches and deletes own watches.
 * @param {String} [path] - Path to be triggered
 * @example
 * watcherObj.destroy()
 */
Watcher.prototype.destroy = function () {
    _.each(this._externalWatches, function (component, watchId) {
        if (component && component.unwatch) {
            component.unwatch(watchId);
        }
    })
    delete this._watches;
}