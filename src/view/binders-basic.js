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
        el.innerHtml = text;
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
        if (component && component._elements) {
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
            _.each(component._elements, function(element) {
                Dom.append(el, element);
            });
        });
        each(_map, function(component) {
            each(component._elements, function(element) {
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