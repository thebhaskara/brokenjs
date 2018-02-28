const _ = require('lodash');
const Dom = require('../standalone/dom');

var _binders = {};

var Binder = module.exports = function(attributes, options) {
    this._binders = _.clone(_binders);
}

var defaultOptions = {
    modes: 'a'
}

var addBinder = Binder.addBinder = Binder.prototype.addBinder = function(name, options, callback) {
    var binders = (this && this._binders) || _binders;
    if (binders[name]) throw (name + " binder already exists");

    if (_.isFunction(options)) {
        callback = options;
        options = defaultOptions;
    }

    var modes = getUniqueModes(options);
    var hasAttributeMode = modes.join().indexOf('a') > -1;
    var selectors = getSelectors(modes, name);
    binders[name] = {
        name: name,
        modes: modes,
        hasAttributeMode: hasAttributeMode,
        selector: selectors,
        callback: callback,
        options: options
    };
}

var getUniqueModes = function(options) {
    var modes = (options && _.isString(options.modes) && options.modes) || 'a';
    modes = modes.toLowerCase().replace(/[^a|^e|^c]/g, '').split();
    return _.uniq(modes);
}

var getSelectors = function(modes, name) {
    return _.map(modes, function(mode) {
        // attribute selector
        if (mode == 'a') {
            return '[' + name + ']';
        }
        // element selector
        else if (mode == 'e') {
            return name;
        }
        // class selector
        else if (mode == 'c') {
            return '.' + name;
        }
    }).join(',');
}