var _ = require('lodash');

/**
 * @feature Attributes
 * @description
 * initializes internal attributes object by the object provided, 
 * otherwise an empty object is initialized. 
 * @param {String} [attributes] - initial attributes object.
 * @example
 * var attributesObj = new Attributes();
 * attributesObj.set('employee', { id:10, name: 'Ryan' })
 * attributesObj.get('employee.name'); // returns 'Rayn'
 * attributesObj.get('employee.id'); // returns 10
 */
var Attributes = module.exports = function(attributes) {
    this._attributes = attributes || {};
}

/**
 * @function get
 * @description
 * Get value from attributes, at the path provided.<br>
 * Internally uses lodash _.get
 * @example
 * attributesObj.get('employee.name'); // returns 'Rayn'
 * attributesObj.get('employee.id'); // returns 10
 * @param {String} [path] - string object path.
 * @functionof Model
 */
Attributes.prototype.get = function(path) {
    if (path) {
        return _.get(this._attributes, path);
    } else {
        return this._attributes;
    }
}

/**
 * @function set
 * @description
 * Set value to attributes, at the path provided.<br>
 * Internally uses lodash _.set
 * @example
 * attributesObj.set('employee', { id:10, name: 'Ryan' })
 * @param {String} path - string object path.
 * @param {Object} value - value to be stored at the provided path.
 */
Attributes.prototype.set = function(path, value) {
    if (!path || path == this) {
        // if path is not provided then it is directly set to the attributes itself.
        this._attributes = value;
    } else {
        _.set(this._attributes, path, value);
    }
    return this;
}

/**
 * @function destroy
 * @description
 * Deletes internal attributes instance.
 * @example
 * attributesObj.destroy();
 */
Attributes.prototype.destroy = function() {
    delete this._attributes;
}