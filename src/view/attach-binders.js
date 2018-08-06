const _ = require('lodash');
const Dom = require('../standalone/dom');

var each = _.each;

var Binder = module.exports = function (attributes, options) {

}

Binder.prototype._render = function () {
    var self = this;
    attachBinders(self.options || {}, self._binders, self);
}

var attachBinders = function (options, binders, that) {
    var includeBinderGroups = options.includeBinderGroups;
    var includeBinders = options.includeBinders;

    if ((!includeBinders || includeBinders.length == 0) &&
        (!includeBinderGroups || includeBinderGroups.length == 0)) {
    } else {
        if (includeBinderGroups) {
            each(includeBinderGroups, function (groupName) {
                each(binders, function (binder, id) {
                    if (binder.options.groupName == groupName) {
                        binders[id] = binder;
                    }
                });
            });
        }
        if (includeBinders) {
            each(includeBinders, function (binderName) {
                each(binders, function (binder, id) {
                    if (binder.name == binderName) {
                        binders[id] = binder;
                    }
                });
            });
        }
    }

    var _binderElements = getAllElementsByBinder(binders, that);

    callAllBinders(binders, _binderElements, that);
};

var getAllElementsByBinder = function (binders, that) {

    // figure out elements wrt binder
    var _binderElements = {};
    each(binders, function (binderObject, binderId) {
        var elements = _binderElements[binderId] = [];
        each(that._elements, function (el) {
            var els = el.querySelectorAll(binderObject.selector);
            each(els, function (el) { elements.push(el) });
            var isQualified;
            each(binderObject.modes, function (mode) {
                if ((mode == 'a' && el.hasAttribute(binderObject.name)) ||
                    (mode == 'e' && el.tagName == binderObject.name)) {
                    isQualified = true;
                    return false;
                }
            });
            if (isQualified) {
                elements.push(el);
            }
        });
    });
    return _binderElements;
}

var callAllBinders = function (binders, _binderElements, that) {
    each(binders, function (binderObject, binderId) {
        each(_binderElements[binderId], function (el) {
            callBinder(el, binderObject, that);
        });
    });
}

var callBinder = function (el, binderObject, that) {
    var property;
    if (binderObject.hasAttributeMode) {
        property = el.getAttribute(binderObject.name);
    }
    binderObject.callback.call(that, el, property);
};