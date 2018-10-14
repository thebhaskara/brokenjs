var glob = require("glob");
var _ = require("lodash");
var { Replacer } = require("./template-operations");

function makeDocs() {

    const docsFolderPath = './docs';
    const docsSourceFolderPath = '.';
    const templatesFolderPath = './docs-src/templates';

    var { getDocs } = require(docsSourceFolderPath + "/doc-operations");
    var { readFile, resetFolder, writeFile } = require(docsSourceFolderPath + "/fs-operations");

    glob("./src/**/*.js", function (er, files) {

        var classMap = {};
        var featureMap = {};

        var result = _.map(files, function (file) {

            var contents = readFile(file);

            var docs = getDocs(contents);

            var realDoc = {};

            _.each(docs, doc => {
                if (doc["class"]) {
                    var className = realDoc["name"] = doc["class"][0];
                    classMap[className] = realDoc;
                    realDoc["description"] = doc["description"] && doc["description"].join(' ');
                    realDoc["inheritsfeaturesfrom"] = doc["inheritsfeaturesfrom"];
                } else if (doc["feature"]) {
                    var featureName = realDoc["name"] = doc["feature"][0];
                    featureMap[featureName] = realDoc;
                    realDoc["description"] = doc["description"] && doc["description"].join(' ');
                    realDoc["examples"] = doc["example"]
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
        var featureTemplate = readFile(templatesFolderPath + '/feature-template.html');
        var functionTemplate = readFile(templatesFolderPath + '/function-template.html');

        var content = '';

        // _.each(result, function (classDoc) {
        //     var c = classDoc.doc;
        _.each(classMap, function (classDoc) {

            var c = classDoc;

            if (c.name) {

                let rep = new Replacer(classTemplate, c);
                rep.setFor('name')
                rep.setFor('description')
                rep.setByList('inheritsfeaturesfrom', '<div class="px-md-3">{}</div>', feature => {
                    if (feature = featureMap[feature]) {
                        feature.name == "Injector" && console.log(feature);
                        let rep = new Replacer(featureTemplate, feature)
                        rep.setFor('name')
                        rep.setFor('description')
                        rep.setWithPreCodeWrapperFor('examples', '\n')

                        rep.setByList('functions', '<div class="px-md-3">{}</div>', fn => {
                            let rep = new Replacer(functionTemplate, fn);
                            rep.setFor('name')
                            rep.setFor('description')
                            rep.setFor('params', '<br>')
                            rep.setWithPreCodeWrapperFor('examples', '\n');
                            return rep.template;
                        })
                        return rep.template;
                    }
                    return '';
                })
                rep.setByList('functions', '<div class="px-md-3">{}</div>', fn => {
                    let rep = new Replacer(functionTemplate, fn);
                    rep.setFor('name')
                    rep.setFor('description')
                    rep.setFor('params', '<br>')
                    rep.setWithPreCodeWrapperFor('examples', '\n');
                    return rep.template;
                })
                rep.setWithPreCodeWrapperFor('examples', '\n');

                content += rep.template;

                // let temp = classTemplate;
                // temp = temp.replace('{name}', c.name);
                // temp = temp.replace('{description}', c.description);

                // // console.log(c.inheritsfeaturesfrom);
                // let inheritsfeaturesfrom = _.map(c.inheritsfeaturesfrom, feature => {
                //     // console.log(feature);
                //     feature = featureMap[feature];
                //     // console.log(feature);
                //     if (!feature) return '';

                //     let temp = featureTemplate;
                //     temp = temp.replace('{name}', feature.name);
                //     temp = temp.replace('{description}', feature.description);
                //     temp = temp.replace('{examples}', feature.examples && feature.examples.join('\n'))

                //     let fns = _.map(feature.functions, fn => {
                //         let temp = functionTemplate;
                //         temp = temp.replace('{name}', fn.name);
                //         temp = temp.replace('{description}', fn.description);
                //         temp = temp.replace('{params}', fn.params && fn.params.join('<br>'));
                //         let exampleText = fn.examples && fn.examples.join('<br>');
                //         exampleText = exampleText.replace('\n', '');
                //         // console.log(JSON.stringify(exampleText));
                //         temp = temp.replace('{examples}', exampleText);
                //         return temp;
                //     });

                //     temp = temp.replace('{functions}', fns.join(''));

                //     return temp;
                // });

                // temp = temp.replace('{inheritsfeaturesfrom}', inheritsfeaturesfrom.join(''));

                // let fns = _.map(c.functions, fn => {
                //     let temp = functionTemplate;
                //     temp = temp.replace('{name}', fn.name);
                //     temp = temp.replace('{description}', fn.description);
                //     temp = temp.replace('{params}', fn.params && fn.params.join('<br>'));
                //     temp = temp.replace('{examples}', fn.examples && fn.examples.join('\n'));
                //     return temp;
                // });

                // temp = temp.replace('{functions}', fns.join(''));

                // content += temp;
            }
        });
        var index = indexTemplate.replace('{content}', content);
        writeFile(docsFolderPath + "/index.html", index);
        console.log("Successfully made docs");
    });
}

module.exports.makeDocs = makeDocs;
