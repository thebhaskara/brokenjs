var Merge = require('./standalone/merge');
var Dom = require('./standalone/dom');
var Model = require('./model');
var HtmlHandler = require('./view/html-handler');
var Binder = require('./view/binder');
require('./view/binders-basic');
require('./view/binders-bind-value');
var Events = require('./view/binders-events');
var MutationEvent = require('./view/bind-mutation');
var AttachBinders = require('./view/attach-binders');
var CssHandler = require('./view/css-handler');
var _ = require('lodash');

/**
 * @class ViewModel
 * @description 
 * ViewModel is structure that has Model abilities along with DOM capabilities.
 * @inheritsfeaturesfrom Attributes
 * @inheritsfeaturesfrom Destroy
 * @inheritsfeaturesfrom Forward
 */
var ViewModel = module.exports = Merge(Model, HtmlHandler, Binder, AttachBinders, Events, CssHandler, MutationEvent);

ViewModel.make = function() {
    return Merge.apply(this, _.concat([ViewModel], arguments));
}

ViewModel.create = function(options) {
    var Fact = ViewModel.make.apply(this, arguments);
    return new Fact();
}

ViewModel.strap = function(component) {
    // console.log("strap", component._name);
    if (_.isArray(component)) {
        _.each(component, ViewModel.strap);
    } else {
        !component._elements && component._render();
        Dom.appendAll(component._elements);
    }
}