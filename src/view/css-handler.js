const _ = require('lodash');
const Dom = require('../standalone/dom');

var CssHandler = module.exports = function(attributes, options) {

}

var viewNameText = 'view-name';
var viewIdText = 'view-id';
CssHandler.prototype.setCss = function(css) {
    css = css || '';

    var id = this._name;
    if (css.indexOf(viewNameText) > -1) {
        css = css.replace(new RegExp(viewNameText, 'g'), this._name);
    }
    if (css.indexOf(viewIdText) > -1) {
        css = css.replace(new RegExp(viewIdText, 'g'), this._id);
        id = this._id;
    }

    var styleEl = Dom.get(id);
    if (_.isNil(styleEl)) {
        styleEl = Dom.create('style');
        styleEl.setAttribute('id', id);
        Dom.append(styleEl);
    }

    styleEl.innerHTML = css;

    return styleEl;
};

CssHandler.prototype._render = function(){
    var self = this;
    self.setCss((self.options && self.options.css) || self.css);
}