var _ = require('lodash');
var Incrementer = require('../standalone/incrementer');

var Watcher = module.exports = function(attributes, options) {
    var self = this;

    self._watches = (options && options.watches) || {};
    self._externalWatches = (options && options.externalWatches) || {};
    attributes && executeWatches(self, self._watches);

    var initWatches = (options && options.initWatches) || self.initWatches;
    if (initWatches) {
        _.each(initWatches, function(fn, key) {
            self.watch(key, fn);
        })
    }
};

var trigger = function(component, path) {
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

        _.each(component._watches, function(watch) {
            if (!watch.path && watch.path == path || _.startsWith(watch.path, path)) {
                watches.push(watch);
            } else if (parentPaths.length > 0 && _.find(parentPaths, watch.path)) {
                watches.push(watch);
            }
        })
    }

    executeWatches(component, watches);
}

var executeWatches = function(component, watches) {
    _.each(watches, function(watch) {
        var value = component.get(watch.path);
        watch.callback.call(component, value);
    });
}

var watchesInc = new Incrementer;
Watcher.prototype.watch = function(component, path, callback) {
    // console.log(component, path, callback);
    var len = arguments.length,
        watchId; //, component, path, callback;
    if (len < 2 || len > 3) {
        throw "invalid arguments";
    } else if (arguments.length == 2) {
        // console.log('calling reccursively!');
        return this.watch(this, component, path);
    } else if (!component || !component.watch) {
        throw "watch is not available";
    } else {
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
        return watchId;
    }
}

Watcher.prototype.unwatch = function(watchId) {
    var self = this;
    if (_.isArray(watchId)) {
        _.each(watchId, function(id) {
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

Watcher.prototype.set = function(path, value) {
    if (arguments.length == 1) {
        trigger(this);
    } else {
        trigger(this, path);
    }
    return this;
}

Watcher.prototype.destroy = function() {
    _.each(this._externalWatches, function(component, watchId) {
        if (component && component.unwatch) {
            component.unwatch(watchId);
        }
    })
    delete this._watches;
}