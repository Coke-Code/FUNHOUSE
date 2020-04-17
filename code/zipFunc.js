let fs = require("fs"); //获取文件系统模块，负责读写文件
let path = require("path"); //工具模块，处理文件路径的小工具
let JSZIP = require("jszip");
let zip = new JSZIP();

module.exports = zipFunc = function () {
    $ = this;
    //读取目录及文件
    $.readDir = function (obj, nowPath) {
        let files = fs.readdirSync(nowPath); //读取目录中的所有文件及文件夹（同步操作）
        files.forEach(function (fileName, index) { //遍历检测目录中的文件
            console.log(fileName, index); //打印当前读取的文件名
            let fillPath = path.join(nowPath,fileName );
            let file = fs.statSync(fillPath); //获取一个文件的属性
            if (file.isDirectory()) { //如果是目录的话，继续查询
                let dirlist = zip.folder(fileName); //压缩对象中生成该目录
                readDir(dirlist, fillPath); //重新检索目录文件
            } else {
                obj.file(fileName, fs.readFileSync(fillPath)); //压缩目录添加文件
            }
        });
    }

    //开始压缩文件
    $.startZIP = function (targetDir, outputZipName, callBack) {
        readDir(zip, targetDir);
        zip.generateAsync({ //设置压缩格式，开始打包
            type: "nodebuffer", //nodejs用
            compression: "DEFLATE", //压缩算法
            compressionOptions: { //压缩级别
                level: 9
            }
        }).then(function (content) {
            if (outputZipName == undefined || outputZipName == '') {
                outputZipName = 'output.zip';
            }
            let outputFile = path.join(targetDir, outputZipName + '.zip');
            fs.writeFileSync(outputFile, content, "utf-8"); //将打包的内容写入 当前目录下的 result.zip中
            let callBackRet = 0;
            if (fs.existsSync(outputFile)) {
                callBackRet= 1;
            } 

            if (callBack != undefined && callBack != null) {
                callBack(callBackRet,outputZipName + '.zip');
            }
        });
    }

    return $;
};

/// [ref] https://blog.csdn.net/weixin_34290352/article/details/93626506