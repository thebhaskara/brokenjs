var _ = require('lodash');

module.exports.select = function(selector) {
    if (selector.startsWith('<')) {
        return makeElements(selector);
    } else {
        return document.querySelectorAll(selector);
    }
}

module.exports.get = function(id){
    return document.getElementById(id);
}

var create = module.exports.create = function(tag) {
    return document.createElement(tag);
}

var append = module.exports.append = function(element) {
    document.body.append(element);
}

module.exports.appendAll = function(elements) {
    _.each(elements, append);
}

var makeElements = module.exports.makeElements = function(markup) {
    var div = create('div');
    div.innerHTML = markup;
    return _.map(div.children);
}


var addClass;
if (document.body.classList) {
    addClass = function(el, className) {
        el.classList.add(className);
    }
} else {
    addClass = function(el, className) {
        el.className += ' ' + className;
    }
}
module.exports.addClass = addClass;


var removeClass;
if (document.body.classList) {
    removeClass = function(el, className) {
        el.classList.remove(className);
    }
} else {
    removeClass = function(el, className) {
        el.className = el.className.replace(new RegExp('(^|\\b)' +
            className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}
module.exports.removeClass = removeClass;