const fs = require("fs");

module.exports.resetFolder = function (docsFolderPath) {
    deleteFolderRecursive(docsFolderPath);
    fs.mkdirSync(docsFolderPath);
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
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

module.exports.readFile = function (file) {
    let contents = fs.readFileSync(file);
    return contents && contents.toString();
};

module.exports.writeFile = function (file, content) {
    return fs.writeFileSync(file, content);
};