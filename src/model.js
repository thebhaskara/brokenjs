var Merge = require('./standalone/merge');
var Id = require('./model/id');
var Name = require('./model/name');
var Attributes = require('./model/attributes');
var Destroy = require('./model/destroy');
var Watcher = require('./model/watcher');

module.exports = Merge(Id, Name, Attributes, Destroy, Watcher);