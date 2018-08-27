const _ = require('lodash');
const Binder = require('./binder');

var Events = module.exports = function() {}

var attachEvent = _.identity;
var detachEvent = _.identity;
if (document) {
    if (document.body.addEventListener) { // standard DOM
        attachEvent = function(event, element, handler) {
            element.addEventListener(event, handler, false)
        }
    } else if (document.body.attachEvent) { // IE
        attachEvent = function(event, element, handler) {
            element.attachEvent('on' + event, handler);
        }
    }

    if (document.body.removeEventListener) { // standard DOM
        detachEvent = function(event, element, handler) {
            element.removeEventListener(event, handler, false)
        }
    } else if (document.body.detachEvent) { // IE
        detachEvent = function(event, element, handler) {
            element.detachEvent('on' + event, handler);
        }
    }
}
Events.attachEvent = function(event, element, handler) {
    if (_.isArray(event)) {
        _.each(event, function(event) {
            attachEvent(event, element, handler);
        });
    } else {
        attachEvent(event, element, handler);
    }
};
Events.detachEvent = function(event, element, handler) {
    if (_.isArray(event)) {
        _.each(event, function(event) {
            detachEvent(event, element, handler);
        });
    } else {
        detachEvent(event, element, handler);
    }
};

Events.createEventBinder = function(event) {
    Binder.addBinder('bind-' + event, function(el, property) {
        var self = this;
        var handler = function(e) {
            self.set(property, e);
            // that.set(property, undefined);
        };
        attachEvent(event, el, handler);
        self.onDestroy.add(function() {
            detachEvent(event, el, handler);
        })
    }, {
        modes: 'a',
        groupName: 'events'
    });
}

_.each([
    // keyboard events
    "keydown", "keypress", "keyup",
    // mouse events
    "click", "dblclick", "mousedown", "mouseenter",
    "mouseleave", "mousemove", "mouseout",
    "mouseover", "mouseup", "mousewheel",
    // input events
    "focus", "blur", "change", "submit", "paste",
    // touch events
    "touchstart", "touchend", "touchmove", "touchcancel",
], Events.createEventBinder);

Events.prototype.attachEvent = function (event, element, handler) {
    Events.attachEvent(event, element, handler);
    this.onDestroy.add(function () {
        Events.detachEvent(event, element, handler);
    });
}