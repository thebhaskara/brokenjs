var _ = require('lodash');

/**
 * @feature Relationship
 * @description
 * Provides abillity to make parent-child relationship
 * @param {Object} attributes - initial attributes object.
 * @param {Object} options - for passing parent and root by options.parent and options.root.
 */
var Relationship = module.exports = function (attributes, options) {
    this._children = [];
    if (options && options.parent) {
        this.setParent(options.parent, options.root);
    }
}

/**
 * @function setParent
 * @description
 * Sets parent and root provided. If root is not provided, parent._root will be assigned as root
 * @example
 * let parentObj = new Relationship();
 * relationshipObj.setParent(parentObj);
 * @param {Relationship} parent - parent object.
 * @param {Relationship} [root] - root object.
 */
Relationship.prototype.setParent = function (parent, root) {
    this._parent = parent;
    this._root = root || (parent && parent._root);
}

/**
 * @function createChild
 * @description
 * Creates an instance of the factory. Also creating the relationship.
 * @example
 * let parentObj = new Relationship();
 * parentObj.createChild(Relationship);;
 * @param {Model} Factory - a model type factory.
 * @param {Object} [attributes] - attributes object to be passed to the factory.
 * @param {Object} [options] - options object to be passed to the factory.
 */
Relationship.prototype.createChild = function (Factory, attributes, options) {
    options = _.assign({}, options, {
        parent: this,
        root: this._root || this
    });

    let child = new Factory(attributes, options);
    this._children.push(child);

    child.onDestroy.add(() => {
        this._children = this._children.filter(child1 => child1._id != child._id);
    })

    return child;
}

/**
 * @function createAndSetChild
 * @description
 * Shortcut for create child component and set it to a path.
 * @example
 * let parentObj = new Relationship();
 * parentObj.createAndSetChild('controls.anotherComponent', Relationship);
 * @param {String} path - attributes path.
 * @param {Model} Factory - a model type factory.
 * @param {Object} [attributes] - attributes object to be passed to the factory.
 * @param {Object} [options] - options object to be passed to the factory.
 */
Relationship.prototype.createAndSetChild = function (path, Factory, attributes, options) {
    let child = this.createChild(Factory, attributes, options);
    this.set(path, child);
    return child;
}

/**
 * @function getParent
 * @description
 * Gets parent. If a name is passed, gets the closest ("grand")parent with that name.<br>
 * passing name helps when components are being wrapped
 * @example
 * parentObj.getParent(); // gets immediate parent
 * parentObj.getParent('name'); // gets closest parent with name
 * @param {String} [name] - name of the parent required.
 */
Relationship.prototype.getParent = function (name) {
    if (name) {
        if (this._parent._name == name) {
            return this._parent;
        } else {
            return this._parent.getParent(name);
        }
    } else {
        return this._parent
    }
}

/**
 * @function destroy
 * @description
 * Destroys all children.
 */
Relationship.prototype.destroy = function () {
    this._children.forEach(child => child && _.isFunction(child.destroy) && child.destroy());
    delete this._children;
    delete this._parent;
    delete this._root;
}