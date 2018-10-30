var _ = require('lodash');

var Relationship = module.exports = function(attributes, options) {
    this._children = [];
    if (options && options.parent) {
        this.setParent(options.parent, options.root);
    }
}

Relationship.prototype.setParent = function(parent, root) {
    this._parent = parent;
    this._root = root || (parent && parent._root);
}

Relationship.prototype.createChild = function(Factory, attributes, options) {
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

Relationship.prototype.createAndSetChild = function(path, Factory, attributes, options) {

    let child = this.createChild(Factory, attributes, options);
    
    this.set(path, child);

    return child;
}

Relationship.prototype.getParent = function(name) {
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

Relationship.prototype.destroy = function() {
    this._children.forEach(child => child && _.isFunction(child.destroy) && child.destroy());
    delete this._children;
    delete this._parent;
    delete this._root;
}