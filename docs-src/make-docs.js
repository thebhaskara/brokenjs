var glob = require("glob");
var _ = require("lodash");
var { Replacer } = require("./replacer");

var isTextTypeProperty = {
    "name": true,
    "type": true,
    "fileUrl": true,
    "class": true,
    "feature": true,
    "function": true,
    "description": true,
    "example": false,
    "param": false,
    "inheritsfeaturesfrom": false,
    "functions": false,
    "id": false,
}
let properties = _.assign({}, isTextTypeProperty);

function makeDocs() {

    const docsFolderPath = './docs';
    const docsSourceFolderPath = '.';
    const templatesFolderPath = './docs-src/templates';

    var { getDocs } = require(docsSourceFolderPath + "/doc-operations");
    var { readFile, resetFolder, writeFile } = require(docsSourceFolderPath + "/fs-operations");

    glob("./src/**/*.js", function (er, files) {

        var classMap = {};
        var featureMap = {};

        _.each(files, function (file) {

            var contents = readFile(file);
            var docs = getDocs(contents);
            var realDoc = {};
            let fileName = "https://github.com/thebhaskara/brokenjs/blob/master/" + file;

            _.each(docs, doc => {

                let res = { fileUrl: fileName + "#L" + doc.lineNumber };
                _.each(doc, (val, property) => {
                    if (isTextTypeProperty[property]) {
                        val = val && val.join(' ');
                    }
                    if (val) {
                        res[property] = val;
                    }
                })

                if (res["class"]) {
                    var name = res["name"] = res["class"];
                    res.type = "class";
                    _.assign(realDoc, res);
                    classMap[name] = realDoc;
                } else if (res["feature"]) {
                    var name = res["name"] = res["feature"];
                    res.type = "feature";
                    _.assign(realDoc, res);
                    featureMap[name] = realDoc;
                } else if (res["function"]) {
                    var functions = realDoc['functions'] || (realDoc['functions'] = []);
                    res["name"] = res["function"];
                    res.type = "function";
                    functions.push(res);
                }
            })
        });

        resetFolder(docsFolderPath);

        var indexTemplate = readFile(templatesFolderPath + '/index.html');
        var template = readFile(templatesFolderPath + '/template.html');


        // var navLinkHtml = '<a href="#{id}" class="list-group-item list-group-item-action"><span class="tab-{tabSize}">{name}</span> <span class="type">{type}</span></a>';
        var addNavLink = function (doc) {
            // let tag = navLinkHtml.replace('{name}', doc.name);
            // tag = tag.replace("{id}", doc.id);
            // tag = tag.replace("{type}", doc.type);
            // tag = tag.replace("{tabSize}", doc.id.split('-').length);
            // navLinks.push(tag);
            navLinksDetails.push({ id: doc.id, name: doc.name, type: doc.type });
        }

        var navLinks = [];
        var navLinksDetails = [];

        let Placer = function (obj, prefix) {
            let id = obj["id"] = obj["name"];
            if (prefix) {
                id = obj["id"] = [prefix, id].join('-');
            }
            addNavLink(obj);
            let rep = new Replacer(template, obj)
            _.each(properties, (value, property) => {
                value = obj[property];
                if (property == "inheritsfeaturesfrom") {
                    rep.setByList('inheritsfeaturesfrom', '<div><small>Features</small><div>{}</div></div>', feature => {
                        if (feature = featureMap[feature]) {
                            return Placer(feature, id).template;
                        }
                        return '';
                    });
                } else if (property == "functions") {
                    rep.setByList('functions', '<div><small>functions</small><div>{}</div></div>', fn => Placer(fn, id).template);
                } else if (property == "param") {
                    rep.setFor(property, '<br>', "<div><small>parameters</small><div>{}</div></div>")
                } else if (property == "example") {
                    rep.setFor(property, '<br>', "<div><small>example</small><div><pre><code>{}</code></pre></div></div>")
                } else if (property == "description") {
                    rep.setFor(property, null, "<div><small>description</small><div>{}</div></div>")
                } else if (property == "type") {
                    rep.setFor(property)
                    rep.setFor(property)
                } else if (property == "id") {
                    rep.setFor(property)
                } else {
                    rep.setFor(property)
                }
            });
            return rep;
        }

        var content = '';

        _.each(classMap, (classDoc) => {
            if (classDoc.name) {
                content += Placer(classDoc).template;
            }
        });

        // var navsection = '<div class="list-group list-group-flush">{}</div>'.replace("{}", navLinks.join(""))

        let navLinksDetailsObj = {}
        _.each(navLinksDetails, detail => {
            _.set(navLinksDetailsObj, detail.id.split('-').join('.children.') + '.node', detail);
        });

        let li = '<li>{}</li>'
        let ul = '<ul>{}</ul>'
        let ahref = '<a href="#{id}">{name}</a>'
        let buildHeirarchy = function (val, key, container) {
            let link = '';
            if (val.node) {
                link = ahref.replace('{id}', val.node.id)
                link = link.replace('{name}', val.node.name)
            }
            let children = '';
            if (val.children) {
                let c = _.map(val.children, (val, key) => buildHeirarchy(val, key));
                children = ul.replace('{}', c.join(""))
            }
            return li.replace('{}', link + children);
        }
        let navs = _.map(navLinksDetailsObj, (val, key) => buildHeirarchy(val, key, ul));

        var index = indexTemplate.replace('{content}', content);
        index = index.replace('{navlinks}', ul.replace('{}', navs.join('')));
        writeFile(docsFolderPath + "/index.html", index);
        console.log("Successfully made docs");
    });
}

module.exports.makeDocs = makeDocs;
