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
// var WatchGet = require('./model/watchGet');

/**
 * @class Model
 * @description
 * following functions are included <br>
 * {@link Attributes#get}
 */
module.exports = Merge(Id, Name, Attributes, Destroy, /* Inject, */Injector, Watcher, Forward, /* WatchGet, */ WatchAll);