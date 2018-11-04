const _ = require('lodash');
const Dom = require('../standalone/dom');

var each = _.each;

var Binder = module.exports = function (attributes, options) {

}

Binder.prototype._render = function () {
    var self = this;
    attachBinders(self.options || {}, self._binders, self);
    setTimeout(function () {
        self.set('_internal.render', true);
    })
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

    var selectors = _.map(binders, function (binder) {
        return binder.selector;
    }).join(', ');

    var els = [];
    each(that._elements, function (el) {
        var selectedElements = el.querySelectorAll(selectors);
        els = els.concat(_.map(selectedElements));
        els.push(el);
    });

    var _binderElements = {};
    each(els, function (el) {
        each(binders, function (binder, binderId) {
            var elements = _binderElements[binderId] = _binderElements[binderId] || [];
            each(binder.modes, function (mode) {
                if ((mode == 'a' && el.hasAttribute(binder.name)) ||
                    (mode == 'e' && el.tagName == binder.name)) {
                    elements.push(el);
                    return false;
                }
            })
        });
    })
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