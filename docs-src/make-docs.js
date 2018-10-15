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

        var content = '';

        let Placer = function (obj) {
            let rep = new Replacer(template, obj)
            _.each(properties, (value, property) => {
                value = obj[property];
                if (property == "inheritsfeaturesfrom") {
                    rep.setByList('inheritsfeaturesfrom', '<div><small>Features</small><div>{}</div></div>', feature => {
                        if (feature = featureMap[feature]) {
                            return Placer(feature).template;
                        }
                        return '';
                    });
                } else if (property == "functions") {
                    rep.setByList('functions', '<div><small>functions</small><div>{}</div></div>', fn => Placer(fn).template);
                } else if (property == "param") {
                    rep.setFor(property, '<br>', "<div><small>parameters</small><div>{}</div></div>")
                } else if (property == "example") {
                    rep.setFor(property, '<br>', "<div><small>example</small><div><pre><code>{}</code></pre></div></div>")
                } else if (property == "description") {
                    rep.setFor(property, null, "<div><small>description</small><div>{}</div></div>")
                } else if (property == "type") {
                    rep.setFor(property)
                    rep.setFor(property)
                } else {
                    rep.setFor(property)
                }
            });
            return rep;
        }

        _.each(classMap, (classDoc) => {
            if (classDoc.name) {
                content += Placer(classDoc).template;
            }
        });

        var index = indexTemplate.replace('{content}', content);
        writeFile(docsFolderPath + "/index.html", index);
        console.log("Successfully made docs");
    });
}

module.exports.makeDocs = makeDocs;
