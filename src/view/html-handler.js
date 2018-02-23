const _ = require('lodash');
const Dom = require('../standalone/dom');

var HtmlHandler = module.exports = function(attributes, options) {
    
    var self = this;

    self._elements = Dom.select(options.html || options.cssSelector);

    var id = [options.name, self._id].join('-');

    _.each(self._elements, function(el) {
        Dom.addClass(el, id);
        Dom.addClass(el, self.name);
    });
}