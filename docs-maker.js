var glob = require("glob");
var _ = require("lodash");
var fs = require("fs");

var docsFolderPath = './docs';

glob("./src/**/*.js", function(er, files) {
    // glob("./src/model.js", function(er, files) {

    var classMap = {};

    var result = _.map(files, function(file) {

        var contents = fs.readFileSync(file);

        var docs = getDocs(contents.toString());

        var realDoc = {};

        _.each(docs, (doc) => {
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
    // var str = JSON.stringify(result);
    // fs.writeFileSync('docs-data.json', str);
    // console.log(str);
    // console.log('made json file!');
    deleteFolderRecursive(docsFolderPath);
    fs.mkdirSync(docsFolderPath);
    var indexTemplate = fs.readFileSync('./doc-templates/index.html').toString();
    var classTemplate = fs.readFileSync('./doc-templates/class-template.html').toString();
    var functionTemplate = fs.readFileSync('./doc-templates/function-template.html').toString();

    var content = '';
    _.each(result, function(classDoc) {
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
    fs.writeFileSync(docsFolderPath + "/index.html", index);
});


function getDocs(contents) {
    var lines = contents.split('\n');
    var res = [];
    var block;

    while (lines.length > 0) {

        var line = lines.shift().trim();

        if (line.startsWith('/**')) {
            block = [];
        } else if (line.startsWith('*') && !line.endsWith('*/')) {
            block.push(line.replace("*", "").trim());
        } else if (line.endsWith('*/')) {
            // block.push(lines.shift().trim());
            processBlock(block, res)
        }
    }

    return res;
}

function processBlock(block, res) {
    var c = {},
        line,
        key = 'description';

    while (block.length > 0 && (line = block.shift().trim())) {

        if (line.startsWith('@')) {
            key = line.split(' ')[0];
            key = key.replace('@', '');
        }

        var val = c[key] || (c[key] = []);
        val.push(gatherLineContent(line.replace('@' + key, '').trim(), block));
    }

    res.push(c);
}

function gatherLineContent(line, block) {
    var text = [line];

    while (block.length > 0 && !block[0].trim().startsWith('@')) {
        text.push(block.shift().trim())
    }

    return text.join('');
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};