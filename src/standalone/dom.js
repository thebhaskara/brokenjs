var _ = require('lodash');

/**
 * @class Dom
 * @description 
 * Provides handles for dom operations
 */


/**
 * @function select
 * @description 
 * Gets the DOM elements matching the given css selector.
 * @param {String} selector - css selector to select elements or if html is provided it will create DOM elements and return.
 * @example
 * Dom.select('div.name') // selects div elements with class "name"
 */
module.exports.select = function(selector) {
    if (selector) {
        if (selector.trim().startsWith('<')) {
            return makeElements(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    } else {
        return [];
    }
}

/**
 * @function get
 * @description 
 * Alias to document.getElementById.
 * @param {String} id - Id of a DOM element.
 * @example
 * Dom.get('name') // selects element with id "name"
 */
module.exports.get = function(id) {
    return document.getElementById(id);
}

/**
 * @function create
 * @description 
 * Alias to document.createElement.
 * @param {String} tag - Tag of a DOM element.
 * @example
 * Dom.create('span') // returns a span element
 */
var create = module.exports.create = function(tag) {
    return document.createElement(tag);
}

/**
 * @function append
 * @description 
 * Alias to document.createElement.
 * @param {String} tag - Tag of a DOM element.
 * @example
 * Dom.create('span') // returns a span element
 */
var append = module.exports.append = function(element, element1) {
    if (element1 instanceof HTMLElement) {
        element.appendChild(element1);
    } else if (element instanceof HTMLElement) {
        document.body.append(element);
    }
}

module.exports.appendAll = function(elements) {
    _.each(elements, append);
}

var makeElements = module.exports.makeElements = function(markup) {
    var div = create('div');
    div.innerHTML = markup;
    return _.map(div.children);
}

var empty = module.exports.empty = function(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};

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