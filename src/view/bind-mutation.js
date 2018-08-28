const _ = require('lodash');
const Binder = require('./binder');

var MutationEvent = module.exports = function () { }

MutationEvent.attachMutationEvent = function (element, handler, config) {
    var observer = new MutationObserver(handler);
    observer.observe(element, config);
    return observer;
}

MutationEvent.prototype.attachMutationEvent = function (element, handler, config) {
    var observer = MutationEvent.attachMutationEvent(element, handler, config);
    this.onDestroy.add(() => observer.disconnect());
}

Binder.addBinder('bind-mutation', function (element, propertyName, options) {

    options = options || element.getAttribute('mutaion-config') || "attributes,childList,subtree";

    var config = {};
    _.each(options.split(','), option => config[option.trim()] = true)

    var callback = (mutationsList) => {
        let mutations = {};
        for (var mutationItem of mutationsList) {
            mutations[mutationItem.type] = mutationItem;
        }
        this.set(propertyName + '.mutations', mutations)
    };

    var observer = this.attachMutationEvent(element, callback, config)
    this.set(propertyName + '.observer', observer);
});