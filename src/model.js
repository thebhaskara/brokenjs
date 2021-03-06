var Merge = require('./standalone/merge');
var Id = require('./model/id');
var Name = require('./model/name');
var Attributes = require('./model/attributes');
var Destroy = require('./model/destroy');
var Watcher = require('./model/watcher');
var Inject = require('./model/inject');
var Injector = require('./model/injector');
var Forward = require('./model/forward');
var WatchAll = require('./model/watchAll');
var Relationship = require('./model/relationship');
var Initializer = require('./model/initializer');
// var WatchGet = require('./model/watchGet');

/**
 * @class Model
 * @description 
 * Model is structure that can handle data, 
 * with typical features like get, set and watch, also with many additional features.<br>
 * Following are all the features that this stucture offers...
 * @inheritsfeaturesfrom Attributes
 * @inheritsfeaturesfrom Destroy
 * @inheritsfeaturesfrom Forward
 * @inheritsfeaturesfrom Id
 * @inheritsfeaturesfrom Name
 * @inheritsfeaturesfrom Injector
 * @inheritsfeaturesfrom Watcher
 * @inheritsfeaturesfrom WathcherAll
 * @inheritsfeaturesfrom Relationship
 * @inheritsfeaturesfrom Initializer
 */
module.exports = Merge(Id, Name, Attributes, Destroy, /* Inject, */Injector, Watcher, Forward, /* WatchGet, */ WatchAll, Relationship, Initializer);