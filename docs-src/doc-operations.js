let getDocs = module.exports.getDocs = function (contents) {
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

let processBlock = module.exports.processBlock = function (block, res) {
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

let gatherLineContent = module.exports.gatherLineContent = function (line, block) {
    var text = [line];

    while (block.length > 0 && !block[0].trim().startsWith('@')) {
        text.push(block.shift().trim())
    }

    return text.join('\n');
}