const _ = require('lodash');
const Dom = require('../standalone/dom');

var _binders = {},
    each = _.each;

var Binder = module.exports = function(attributes, options) {
    attachBinders(options || {}, this._binders, this);
}

var attachBinders = function(options, binders, that) {
    var includeBinderGroups = options.includeBinderGroups;
    var includeBinders = options.includeBinders;

    // var binders = [];
    if ((!includeBinders || includeBinders.length == 0) &&
        (!includeBinderGroups || includeBinderGroups.length == 0)) {
        // binders = globalBinders;
    } else {
        if (includeBinderGroups) {
            each(includeBinderGroups, function(groupName) {
                each(binders, function(binder, id) {
                    if (binder.options.groupName == groupName) {
                        binders[id] = binder;
                    }
                });
            });
        }
        if (includeBinders) {
            each(includeBinders, function(binderName) {
                each(binders, function(binder, id) {
                    if (binder.name == binderName) {
                        binders[id] = binder;
                    }
                });
            });
        }

    }
    each(binders, attachBinder(options, binders, that));
};

var attachBinder = function(options, binders, that) {
    return function(binderObject, binderId) {
        each(that._elements, function(el) {
            var els = el.querySelectorAll(binderObject.selector);
            each(els, function(el) {
                callBinder(el, binderObject, that);
            });

            var isQualified;
            each(binderObject.modes, function(mode) {
                if ((mode == 'a' && el.hasAttribute(binderObject.name)) ||
                    (mode == 'e' && el.tagName == binderObject.name)) {
                    isQualified = true;
                    return false;
                }
            });
            if (isQualified) {
                callBinder(el, binderObject, that);
            }
        });
    };
};

var callBinder = function(el, binderObject, that) {

    var property;
    if (binderObject.hasAttributeMode) {
        property = el.getAttribute(binderObject.name);
    }
    binderObject.callback.call(that, el, property);
};