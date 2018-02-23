var _ = require('lodash');
var Binder = require('./binder');

Binder.addBinder('bind-text', function(el, property) {
    this.watch(property, function(text) {
        if(_.isArray(text) || _.isObject(text)){
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