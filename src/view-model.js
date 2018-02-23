var Merge = require('./standalone/merge');
var Model = require('./model');
var HtmlHandler = require('./view/html-handler');
var Binder = require('./view/binder');
require('./view/binders-basic');
var AttachBinders = require('./view/attach-binders');
var CssHandler = require('./view/css-handler');

module.exports = Merge(Model, HtmlHandler, Binder, AttachBinders, CssHandler);