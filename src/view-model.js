var Merge = require('./standalone/merge');
var Dom = require('./standalone/dom');
var Model = require('./model');
var HtmlHandler = require('./view/html-handler');
var Binder = require('./view/binder');
require('./view/binders-basic');
require('./view/binders-bind-value');
var Events = require('./view/binders-events');
var AttachBinders = require('./view/attach-binders');
var CssHandler = require('./view/css-handler');
var _ = require('lodash');

var ViewModel = module.exports = Merge(Model, HtmlHandler, Binder, AttachBinders, Events, CssHandler);

ViewModel.make = function() {
    return Merge.apply(this, _.concat([ViewModel], arguments));
}

ViewModel.create = function(options) {
    var Fact = ViewModel.make.apply(this, arguments);
    return new Fact();
}

ViewModel.strap = function(component) {
    if (_.isArray(component)) {
        _.each(component, ViewModel.strap);
    } else {
        Dom.appendAll(component._elements);
    }
}