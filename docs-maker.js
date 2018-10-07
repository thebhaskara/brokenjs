var glob = require("glob");
var _ = require("lodash");
var fs = require("fs");

glob("./src/**/*.js", function(er, files) {

    var result = _.map(files, function(file) {

        var contents = fs.readFileSync(file);

        return {
            file: file,
            docs: getDocs(contents.toString())
        };
    });

    fs.writeFileSync('docs-data.json', JSON.stringify(result));

    console.log('made json file!');
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
            block.push(lines.shift().trim());
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