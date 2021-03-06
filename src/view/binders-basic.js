var _ = require('lodash');
var Binder = require('./binder');
var Dom = require('../standalone/dom');

Binder.addBinder('bind-text', function(el, property) {
    this.watch(property, function(text) {
        if (_.isArray(text) || _.isObject(text)) {
            text = JSON.stringify(text);
        }
        el.innerText = text;
    });
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-html', function(el, property) {
    this.watch(property, function(text) {
        el.innerHTML = text;
    });
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-element', function(el, property) {
    this.set(property, el);
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-component', function(el, property) {
    this.watch(property, function(component) {
        Dom.empty(el);
        if (component && component._render) {
            !component._elements && component._render();
            _.each(component._elements, function(element) {
                Dom.append(el, element);
            });
        }
    });
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-components', function(el, property) {
    var _map = {};
    Dom.empty(el);
    this.watch(property, function(components) {
        if (_.isNil(components) || !_.isArray(components)) {
            components = [];
            // return;
        }
        var map = {};
        _.each(components, function(component) {
            var id = component._id;
            delete _map[id];
            map[id] = component;
            !component._elements && component._render();
            _.each(component._elements, function(element) {
                Dom.append(el, element);
            });
        });
        _.each(_map, function(component) {
            _.each(component._elements, function(element) {
                el.removeChild(element);
            });
        });
        _map = map;
    });
}, {
    modes: 'a',
    groupName: 'basic'
});


Binder.addBinder('bind-class', function(el, property) {
    var classesMap = {};
    this.watch(property, function(value) {
        _.each(classesMap, function(v, key) {
            classesMap[key] = false;
        })
        if (_.isNil(value)) value = [];
        if (_.isArray(value)) {
            _.each(value, function(item) {
                classesMap[item] = true;
            })
        } else if (_.isString(value)) {
            classesMap[value] = true;
        } else if (_.isObject(value)) {
            _.each(value, function(v, key) {
                classesMap[key] = v;
            });
        }
        _.each(classesMap, function(isTrue, key) {
            if (isTrue === true) {
                Dom.addClass(el, key);
            } else {
                Dom.removeClass(el, key);
            }
        })
    });
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-show', function(el, property) {
    var fn = function(value) {
        // if(property == "hasChildren") console.log('what is the problem?');
        // console.log(this._name,this._id, property, value);
        if (value) {
            el.style.display = null;
        } else {
            el.style.display = "none";
        }
    };
    this.watch(property, fn);
    // fn(this.get(property));
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-hide', function(el, property) {
    var fn = function(value) {
        if (value) {
            el.style.display = "none";
        } else {
            el.style.display = null;
        }
    };
    this.watch(property, fn);
    // fn(this.get(property));
}, {
    modes: 'a',
    groupName: 'basic'
});

Binder.addBinder('bind-src', function(el, property) {
    this.watch(property, function(value) {
        el.src = value;
    });
    // this.set(property, this.get(property));
}, {
    modes: 'a',
    groupName: 'basic'
});