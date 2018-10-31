var _ = require('lodash');

/**
 * @feature Initializer
 * @description 
 * This feature runs all the functions stating with "initialize_" in the constructor (while creating a new object)
 * @example
 * let Fact = {
 *     initialize_message: function(attributes, options){
 *         console.log('initialize_message method is called!')
 *     } 
 * }
 * let Factory = Broken.Merge(Fact);
 * let obj = new Factory(); // prints 'initialize_message method is called!' message
 */
var Initializer = module.exports = function () { };

Initializer.whenMergerPropertyBinding = function (val, key, base, init, flags) {
    if (_.isFunction(val) && key.startsWith('initialize_')) {
        init.add(val);
    }
}