var glob = require("glob");
var _ = require("lodash");
// var fs = require("fs");
var { getDocs } = require("./docs-src/doc-operations");
var { readFile, resetFolder, writeFile } = require("./docs-src/fs-operations");

const docsFolderPath = './docs';
const docsSourceFolderPath = './docs-src';
const templatesFolderPath = docsSourceFolderPath + '/templates';

glob("./src/**/*.js", function (er, files) {
    // glob("./src/model.js", function(er, files) {

    var classMap = {};

    var result = _.map(files, function (file) {

        var contents = readFile(file);

        var docs = getDocs(contents);

        var realDoc = {};

        _.each(docs, doc => {
            if (doc["class"]) {
                var className = realDoc["name"] = doc["class"][0];
                classMap[className] = realDoc;
                realDoc["description"] = doc["description"] && doc["description"].join(' ');
            } else if (doc["function"]) {
                var functions = realDoc['functions'] || (realDoc['functions'] = []);
                var functionsMap = realDoc['functionsMap'] || (realDoc['functionsMap'] = {});
                var fn = {
                    name: doc["function"][0],
                    description: doc["description"] && doc["description"].join(' '),
                    functionof: doc["functionof"] && doc["functionof"][0],
                    examples: doc["example"],
                    params: doc["param"],
                }
                functionsMap[fn.name] = fn;
                functions.push(fn);
            }
        })

        return {
            file: file,
            doc: realDoc,
            docs
        };
    });

    resetFolder(docsFolderPath);

    var indexTemplate = readFile(templatesFolderPath + '/index.html');
    var classTemplate = readFile(templatesFolderPath + '/class-template.html');
    var functionTemplate = readFile(templatesFolderPath + '/function-template.html');

    var content = '';

    _.each(result, function (classDoc) {

        var c = classDoc.doc;

        if (c.name) {

            let temp = classTemplate;
            temp = temp.replace('{name}', c.name);
            temp = temp.replace('{description}', c.description);

            let fns = _.map(c.functions, fn => {
                let temp = functionTemplate;
                temp = temp.replace('{name}', fn.name);
                temp = temp.replace('{description}', fn.description);
                temp = temp.replace('{params}', fn.params && fn.params.join('<br>'));
                temp = temp.replace('{examples}', fn.examples && fn.examples.join('<br>'));
                return temp;
            });

            temp = temp.replace('{functions}', fns.join(''));

            content += temp;
        }
    });
    var index = indexTemplate.replace('{content}', content);
    writeFile(docsFolderPath + "/index.html", index);
});

