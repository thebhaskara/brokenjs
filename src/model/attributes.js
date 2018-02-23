var _ = require('lodash');

var Attributes = module.exports = function(attributes) {
    this._attributes = attributes || {};
}

Attributes.prototype.get = function(path) {
    if (path) {
        return _.get(this._attributes, path);
    } else {
        return this._attributes;
    }
}

Attributes.prototype.set = function(path, value) {
    if (!path || path == this) {
        this._attributes = value;
    } else {
        _.set(this._attributes, path, value);
    }
    return this;
}

Attributes.prototype.destroy = function() {
	delete this._attributes;
}