const _ = require('lodash');
const Dom = require('../standalone/dom');

var HtmlHandler = module.exports = function(attributes, options) {

}

HtmlHandler.prototype._render = function(){
    var self = this;
    var options = self.options || {};

    self._elements = Dom.select(options.html || options.cssSelector ||
        self.html || self.cssSelector);
    // console.log("html-handler", "_render", self._name, self._elements);

    var id = [self._name, self._id].join('-');

    _.each(self._elements, function(el) {
        Dom.addClass(el, id);
        Dom.addClass(el, self._name);
    });
}