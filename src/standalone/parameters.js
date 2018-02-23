var _ = require('lodash');

var parameters = module.exports = function(options, fn) {
    var required = [];
    _.each(options, function(option, index) {
        option.index = index;
        if (option.isRequired || option.isOptional != true) {
            required.push(option);
        }
    });
    return function() {
        var args = arguments;
        if (args.length < required.length) {
            throw "Invalid arguments!";
        } else {
            var optionalCount = args.length - required.length;
            for
        }
    }
}