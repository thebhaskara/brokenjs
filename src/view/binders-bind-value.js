const _ = require('lodash');
const Binder = require('./binder');
const Events = require('./binders-events');
const each = _.each;
const throttle = _.throttle;
const isNil = _.isNil;

var getValue = function (el, prop) {
    return el[prop];
};
var setValue = function (el, prop, val) {
    el[prop] = val;
}
var valueProperties = {
    'INPUT': 'value',
    'TEXTAREA': 'value',
    'SELECT': 'values',
    'DIV': 'innerText',
}
var getValueProperty = function (el) {
    var valueProperty = valueProperties[el.tagName];
    if (valueProperty == "value") {
        var type = el.getAttribute('type')
        type = type && type.toLowerCase();
        if (type == 'checkbox') {
            valueProperty = "checked";
        }
    }
    return valueProperty;
}
Binder.addBinder('bind-value', function (el, property) {
    var self = this;
    var isHandlerCalled = false;
    var valueProperty = getValueProperty(el);
    var _value;
    var handler = throttle(function (event) {
        var key = event.keyCode;
        if (key != 16 && key != 17 && key != 18) {
            _value = getValue(el, valueProperty, event.target)
            self.set(property, _value);
        }
    }, 100);

    each(['change', 'keyup'], function (eventName) {
        Events.attachEvent(eventName, el, handler);
    });

    self.watch(property, function (value) {
        if (_value != value && !isNil(value)) {
            setValue(el, valueProperty, value);
            _value = value;
        }
    });

}, {
        modes: 'a',
        groupName: 'basic'
    });