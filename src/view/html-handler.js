const _ = require('lodash');
const Dom = require('../standalone/dom');

var HtmlHandler = module.exports = function(attributes, options) {
    options = options || {};
    var self = this;

    self._elements = Dom.select(options.html || options.cssSelector ||
    	self.html || self.cssSelector);

    var id = [self._name, self._id].join('-');

    _.each(self._elements, function(el) {
        Dom.addClass(el, id);
        Dom.addClass(el, self._name);
    });

    // console.log(self._elements);
}