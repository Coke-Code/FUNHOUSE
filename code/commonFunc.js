var fs = require("fs"),
    path = require('path');

module.exports = commonFunc = function () {
    $ = this;
    $.loadIni = function(filename){
        var r = [],
            q = require("querystring"),
            f = require("fs").readFileSync(filename, "ascii"),
            v = q.parse(f, '[', ']'),
            t;
        for (var i in v) {
            if (i != '' && v[i] != '') {
                r[i] = [];
                t = q.parse(v[i], '\n', '=');
                for (var j in t) {
                    if (j != '' && t[j] != '')
                        r[i][j] = t[j];
                }
            }
        }
        return r;
    };

    $.deleteFolderRecursive = function(dirName) {
        var files = [];
        if (fs.existsSync(dirName)) {

            files = fs.readdirSync(dirName);
            files.forEach(function (file, index) {

                var curPath = path.join(dirName, file);
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);

                } else {
                    fs.unlinkSync(curPath);
                }
            });
    
            fs.rmdirSync(dirName);
        } else {
            console.log("dirName invalid");
        }
    };

    $.readFileList = function(dir, filesList = []) {
        const files = fs.readdirSync(dir);
        //console.log(files);
        files.forEach((item, index) => {
            var fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {      
                readFileList(path.join(dir, item), filesList);  //递归读取文件
            } else {                
                filesList.push(fullPath);                     
            }        
        });
        return filesList;
    };
    

    return $;
};