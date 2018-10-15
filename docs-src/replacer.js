let _ = require("lodash");



let Replacer = module.exports.Replacer = function (template, obj) {
    this.template = template
    this.obj = obj
}

Replacer.prototype.set = function (name, value) {
    this.template = this.template.replace('{' + name + '}', value)
}

Replacer.prototype.setBy = function (name, callback) {
    this.set(name, callback(this.obj[name]));
}

Replacer.prototype.setByList = function (name, wrapper, callback) {
    let list = _.map(this.obj[name], item => callback(item))
    let text = list.join('');
    if (text && wrapper) {
        text = wrapper.replace('{}', text);
    }
    this.set(name, text);
}

Replacer.prototype.setFor = function (name, joinby, wrapper) {
    let value = this.obj[name];
    if (joinby) {
        value = value && value.join(joinby);
    }
    if (value && value.startsWith('\n')) {
        value = value.replace('\n', '');
    }
    let content = '';
    if (value && wrapper) {
        content = wrapper.replace('{}', value);
    } else if (value) {
        content = value;
    }
    this.set(name, content);
}

Replacer.prototype.setWithSpanWrapperFor = function (name, joinby) {
    this.setFor(name, joinby, '<span>{}</span>');
}

Replacer.prototype.setWithPreCodeWrapperFor = function (name, joinby) {
    this.setFor(name, joinby, '<pre><code>{}</code></pre>');
}
