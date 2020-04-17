var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    Stream = require('stream').Stream;

var querystring = require('querystring');
var exec = require('child_process').execFile;
var crypto = require('crypto');
var sd = require('silly-datetime');

var comFunc = require('./commonFunc')()
var zipFunc = require('./zipFunc')()
var comStr = require('./commomStr')

var userFileCacheDirName = comStr.UserCacheDirName;
var taskMap = new Map();

module.exports = xx = function () {
    var $ = this;
    var pdfConsoleExe = path.resolve(__dirname, '../tool/PDFConsole.exe');
    console.log(pdfConsoleExe);

    var pdfTool = path.resolve(__dirname, "../tool2/pdftool.exe");
    console.log(pdfTool);


    try {
        fs.mkdirSync(userFileCacheDirName);
    } catch (e) {}

    function ExcuteCmd(toolExe, taskType, taskMD5, cmdJson, callback) {
        console.log("fun() start");
        let child = exec(toolExe, cmdJson, function (err, stdout, stderr) {
            console.log(err)
            console.log(stdout.toString());
            console.log(stderr.toString());
            if (toolExe.indexOf("pdftool.exe") != -1) {
                callback(stderr.toString());
            } else {
                callback(stdout.toString());
            }
        });
        if (taskType == comStr.MsgType.kStartConvert) {
            taskMap.set(taskMD5, child);
            console.log("Add Current TaskMapSize:" + taskMap.size);
        }
        console.log(child);
    }

    function Init(jsonTxt) {
        var fileMD5 = jsonTxt['FileMD5'];
        var fileUserFilePath = path.join(__dirname, userFileCacheDirName, fileMD5);
        console.log(fileUserFilePath);
        try {
            fs.mkdirSync(fileUserFilePath, {
                recursive: true
            }, (err) => {
                if (err) throw err;
            });
        } catch (e) {
            console.log('make dir fail' + fileUserFilePath);
        }

        try {
            var fileUserFileInfo = path.join(fileUserFilePath, 'info.json');
            fs.writeFile(fileUserFileInfo, jsonTxt, function (err) {
                if (err) {
                    console.log(err);
                }
            })
        } catch (error) {

        }

        return 'OK';
    }

    function GetPathMD5(fileMD5, fileExt) {
        var fileNameWithExt = fileMD5 + '.' + fileExt;
        var filePath = path.join(__dirname, '../', userFileCacheDirName, fileMD5, fileNameWithExt);
        var time = sd.format(new Date(), 'YYYYMMDD');
        var combineStr = filePath + comStr.StrXunJie + time;
        var m = crypto.createHash('md5');
        m.update(combineStr, 'utf8');
        var pathMD5 = m.digest('hex');
        return pathMD5;
    }

    function GetTaskType(fromType, toType) {
        if (fromType == comStr.FileType.kPDF) {
            if (toType == comStr.FileType.kDoc || toType == comStr.FileType.kDocx) {
                return "file2word";
            }

            if (toType == comStr.FileType.kXls || toType == comStr.FileType.kXlsx) {
                return "file2excel";
            }

            if (toType == comStr.FileType.kPpt || toType == comStr.FileType.kPptx) {
                return "file2ppt";
            }

            if (toType == comStr.FileType.kPng || toType == comStr.FileType.kJpg ||
                toType == comStr.FileType.kBmp || toType == comStr.FileType.kTif ||
                toType == comStr.FileType.kGif) {
                return "file2img";
            }

            if (toType == comStr.FileType.kHtml) {
                return "file2html";
            }

            if (toType == comStr.FileType.kTxt) {
                return "file2txt";
            }
        }

        if (toType == comStr.FileType.kPDF) {
            if (fromType == comStr.FileType.kPng || fromType == comStr.FileType.kJpg ||
                fromType == comStr.FileType.kBmp || fromType == comStr.FileType.kTif ||
                fromType == comStr.FileType.kGif) {
                return "img2pdf";
            }

            return "file2pdf";
        }

        return "file2word";
    }

    function GetFileExt(FileType) {
        if (FileType == comStr.FileType.kPDF) {
            return comStr.FileTypeStr.kPDF;
        } else if (FileType == comStr.FileType.kDoc) {
            return comStr.FileTypeStr.kDoc;
        } else if (FileType == comStr.FileType.kDocx) {
            return comStr.FileTypeStr.kDocx;
        } else if (FileType == comStr.FileType.kPpt) {
            return comStr.FileTypeStr.kPpt;
        } else if (FileType == comStr.FileType.kPptx) {
            return comStr.FileTypeStr.kPptx;
        } else if (FileType == comStr.FileType.kXls) {
            return comStr.FileTypeStr.kXls;
        } else if (FileType == comStr.FileType.kXlsx) {
            return comStr.FileTypeStr.kXlsx;
        } else if (FileType == comStr.FileType.kHtml) {
            return comStr.FileTypeStr.kHtml;
        } else if (FileType == comStr.FileType.kPng) {
            return comStr.FileTypeStr.kPng;
        } else if (FileType == comStr.FileType.kJpg) {
            return comStr.FileTypeStr.kJpg;
        } else if (FileType == comStr.FileType.kTif) {
            return comStr.FileTypeStr.kTif;
        } else if (FileType == comStr.FileType.kGif) {
            return comStr.FileTypeStr.kGif;
        } else if (FileType == comStr.FileType.kBmp) {
            return comStr.FileTypeStr.kBmp;
        } else if (FileType == comStr.FileType.kTxt) {
            return comStr.FileTypeStr.kTxt;
        }

        return comStr.FileTypeStr.kPDF;
    }

    function GetProgress(iniPath) {
        try {
            var loadObj = comFunc.loadIni(iniPath);
            var Info = loadObj['progress'];
            var prg = Info['progress'];
            var msg = Info['message'];
            //console.log(prg);
            var arrayItem = [];
            arrayItem.push(prg);
            arrayItem.push(msg);
            return arrayItem;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    function GetTaskWorkDir(taskMD5) {
        return path.join(__dirname, '../', userFileCacheDirName, taskMD5);
    }

    function GetTaskIniProgress(taskMD5) {
        let progressIniName = taskMD5 + '_' + 'progress.ini';
        return path.join(GetTaskWorkDir(taskMD5), progressIniName);
    }

    function GetTaskOutputDir(taskMD5) {
        return path.join(GetTaskWorkDir(taskMD5), 'output');
    }

    function ParameterValid(obj) {
        if (obj != undefined && obj != null) {
            return 1;
        }
        return 0;
    }

    function IsPhoto(toType) {
        if (toType == comStr.FileType.kPng || toType == comStr.FileType.kJpg ||
            toType == comStr.FileType.kBmp || toType == comStr.FileType.kTif ||
            toType == comStr.FileType.kGif) {
            return 1;
        }
        return 0;
    }

    $.Init = function (req, callback) {

        var postData = '';
        req.on('data', function (chuck) {
            postData += chuck;
        })

        req.on('end', function () {
            try {
                console.log(postData);
                var jsonTxt = JSON.parse(postData);
                //console.log(jsonTxt);                
            } catch (error) {
                var resJson = {
                    'MsgType': comStr.MsgType.kInit,
                    'ErrorCode': -100,
                    'ErrorMsg': 'post data invalid'
                };
                callback('fail', JSON.stringify(resJson));
                return;
            }

            try {
                var msgType = jsonTxt['MsgType'];
                var fileMD5 = jsonTxt['FileMD5']
                if ((msgType == undefined || msgType == null) || (fileMD5 == undefined || fileMD5 == null || fileMD5 == "")) {
                    callback("invalid_req_param", JSON.stringify({
                        'MsgType': comStr.MsgType.kInvalid,
                        'ErrorCode': -1
                    }));
                    return;
                }

                switch (msgType) {
                    case comStr.MsgType.kGetPageCount:
                        if (fileMD5 != undefined) {
                            var fileNameWithExt = fileMD5 + '.' + GetFileExt(jsonTxt['FromFileType']);
                            var filePath = path.join(GetTaskWorkDir(fileMD5), fileNameWithExt);
                            if (fs.existsSync(filePath)) {
                                console.log(fileMD5);
                                console.log(fs.statSync(filePath).size);
                            } else {
                                console.log(fileMD5 + ' NOT Exist');
                                callback('invalid_req_param', JSON.stringify({
                                    'MsgType': comStr.MsgType.kGetPageCount,
                                    'ErrorCode': -2,
                                    'PageCount': -3
                                }));
                                return;
                            }

                            var filePwd = jsonTxt['Pwd'];
                            var cmdGetPageCount = [filePath];
                            if (filePwd != null && filePwd != undefined && filePwd != "") {
                                cmdGetPageCount = [filePath, filePwd];
                            }

                            ExcuteCmd(pdfConsoleExe, comStr.MsgType.kGetPageCount, fileMD5, cmdGetPageCount, function (pageNum) {
                                var resPageNum = Number(pageNum);
                                if (Number(pageNum) == 0) {
                                    resPageNum = -1; //文件是加密的
                                } else if (Number(pageNum) == -1) {
                                    resPageNum = -2; //文件是损坏的
                                }

                                var resJON = {
                                    'MsgType': comStr.MsgType.kGetPageCount,
                                    'ErrorCode': 0,
                                    'PageCount': resPageNum
                                };
                                console.log(resJON);
                                var strJson = JSON.stringify(resJON);
                                console.log(strJson);
                                callback("ok", strJson);
                            });
                        } else {
                            callback('invalid_req_param', JSON.stringify({
                                'MsgType': comStr.MsgType.kGetPageCount,
                                'ErrorCode': -1,
                                'PageCount': -3
                            }));
                        }
                        break;
                    case comStr.MsgType.kStartConvert:
                        if (fileMD5 != undefined) {
                            /// 计算md5(pdf路径+pHuDdunf+{年月日})
                            var pathMD5 = GetPathMD5(fileMD5, GetFileExt(jsonTxt['FromFileType']));
                            /// 获取转换类型字符串
                            var taskType = GetTaskType(jsonTxt['FromFileType'], jsonTxt['ToFileType']);
                            /// pdf路径 
                            var fileWorkPath = GetTaskWorkDir(fileMD5)

                            var fileNameWithExt = fileMD5 + '.' + GetFileExt(jsonTxt['FromFileType']);
                            var srcFilePath = path.join(fileWorkPath, fileNameWithExt);
                            if (!fs.existsSync(srcFilePath)) {
                                var resTestJson = {
                                    'MsgType': comStr.MsgType.kStartConvert,
                                    'ErrorCode': -1
                                };
                                callback("invalid_req_param", JSON.stringify(resTestJson));
                                return
                            }

                            /// 转换结果输出目录
                            var outputFilePath = GetTaskOutputDir(fileMD5);
                            if (fs.existsSync(outputFilePath)) {
                                comFunc.deleteFolderRecursive(outputFilePath);
                            }
                            fs.mkdirSync(outputFilePath);

                            /// 转换过程ini文件，其记录了进度
                            var progressIniPath = GetTaskIniProgress(fileMD5);
                            if (fs.existsSync(progressIniPath)) {
                                fs.unlinkSync(progressIniPath);
                            }
                            /// 转换页数范围
                            var pageRange = jsonTxt['PageRange'];
                            /// 目标文件后缀，通过ToFileType获取
                            var dstFileExt = GetFileExt(jsonTxt['ToFileType']);
                            /// 原文件密码
                            var filePwd = jsonTxt['Pwd'];

                            ///转换命令
                            var cmdConvertJSON = [pathMD5, taskType, srcFilePath, outputFilePath, progressIniPath, pageRange == undefined ? '' : pageRange, dstFileExt, filePwd == undefined ? '' : filePwd];

                            if (filePwd != undefined && filePwd != "") {
                                var fileNameDecryptWithExt = 'decrypt_' + fileMD5 + '.' + GetFileExt(jsonTxt['FromFileType']);
                                var outputFilePathDecrypt = path.join(fileWorkPath, fileNameDecryptWithExt);
                                var cmdJSON = ["--decrypt", "--password=" + filePwd, srcFilePath, outputFilePathDecrypt];

                                ExcuteCmd(pdfTool, comStr.MsgType.kVerifyPassword, fileMD5, cmdJSON, function (err) {
                                    var passwordCheckOK = 1;
                                    if (err != undefined && err != "") {
                                        if (err.indexOf("invalid password") != -1) {
                                            var resJON = {
                                                'MsgType': comStr.MsgType.kStartConvert,
                                                'ErrorCode': -2
                                            };
                                            console.log(resJON);
                                            callback("fail", JSON.stringify(resJON));
                                            passwordCheckOK = 0;
                                            return;
                                        }
                                    }

                                    if (passwordCheckOK == 1) {
                                        ExcuteCmd(pdfConsoleExe, comStr.MsgType.kStartConvert, fileMD5, cmdConvertJSON, function (err) {
                                            if (err != undefined && err != "") {
                                                var resJON = {
                                                    'MsgType': comStr.MsgType.kStartConvert,
                                                    'ErrorCode': -3
                                                };
                                            }
                                        });

                                        var resTestJson = {
                                            'MsgType': comStr.MsgType.kStartConvert,
                                            'ErrorCode': 0
                                        };
                                        callback("ok", JSON.stringify(resTestJson));
                                    }
                                });
                            } else {
                                ExcuteCmd(pdfConsoleExe, comStr.MsgType.kStartConvert, fileMD5, cmdConvertJSON, function (err) {
                                    if (err != undefined && err != "") {
                                        var resJON = {
                                            'MsgType': comStr.MsgType.kStartConvert,
                                            'ErrorCode': -3
                                        };
                                    }
                                });

                                var resTestJson = {
                                    'MsgType': comStr.MsgType.kStartConvert,
                                    'ErrorCode': 0
                                };
                                callback("ok", JSON.stringify(resTestJson));
                            }

                        } else {
                            callback('invalid_req_param', JSON.stringify({
                                'MsgType': comStr.MsgType.kStartConvert,
                                'ErrorCode': -1
                            }));
                        }
                        break;
                    case comStr.MsgType.kHeartBeat:
                        /// 读取MD5的文件相应的ini解析其中progress并返回给客户端
                        if (fileMD5 != undefined) {
                            var convertDone = 0;
                            var progressIniPath = GetTaskIniProgress(fileMD5);
                            var arrayIni = GetProgress(progressIniPath);
                            var errMessge = arrayIni.pop();
                            var progress = arrayIni.pop();
                            if (errMessge != undefined && errMessage != "") {
                                var resJson = {
                                    'MsgType': comStr.MsgType.kHeartBeat,
                                    'FileMD5': fileMD5,
                                    'Progress': -1,
                                    'ConvertDone': convertDone,
                                    'errMsg': errMessge
                                };
                                callback("ok", JSON.stringify(resJson));
                                return;
                            }

                            if (Number(progress) == 100) {
                                if (taskMap.has(fileMD5)) {
                                    taskMap.delete(fileMD5);
                                    console.log("conVertDone After del cur taskSize=" + taskMap.size);
                                }
                                convertDone = 1;
                            }
                            var resJson = {
                                'MsgType': comStr.MsgType.kHeartBeat,
                                'FileMD5': fileMD5,
                                'Progress': Number(progress),
                                'ConvertDone': convertDone
                            };
                            callback("ok", JSON.stringify(resJson));
                        } else {
                            callback('invalid_req_param', JSON.stringify({
                                'MsgType': comStr.MsgType.kHeartBeat,
                                'ErrorCode': -1
                            }));
                        }
                        break;
                    case comStr.MsgType.kStopConvert:
                        if (fileMD5 != undefined) {
                            if (taskMap.has(fileMD5)) {
                                let child = taskMap.get(fileMD5);
                                child.kill();
                                child.on('exit', function (code, signal) {
                                    if (code) {
                                        console.log("child exit code:" + code)
                                    } else {
                                        console.log("child exit signal:" + signal)
                                    }

                                    taskMap.delete(fileMD5);
                                    console.log("After del cur taskSize=" + taskMap.size);
                                });

                                var resJson = {
                                    'MsgType': comStr.MsgType.kStopConvert,
                                    'ErrorCode': 0
                                };
                                callback("ok", JSON.stringify(resJson));
                            }
                        } else {
                            callback('invalid_req_param', JSON.stringify({
                                'MsgType': comStr.MsgType.kHeartBeat,
                                'ErrorCode': -1
                            }));
                        }
                        break;
                    case comStr.MsgType.kGetFileUrl:
                        var outputDir = GetTaskOutputDir(fileMD5);
                        var errorCode = 0;
                        if (fs.existsSync(outputDir) ) {
                            var fileList = [];
                            if (ParameterValid(jsonTxt['ToFileType']) == 1 && IsPhoto(jsonTxt['ToFileType'])){
                                zipFunc.startZIP(outputDir, fileMD5, function (ret, outputFilePath) {
                                    if (ParameterValid(ret) == 1 && ret == 1 && ParameterValid(outputFilePath) == 1) {

                                        fileList.push(outputFilePath);
                                        var resJson = {
                                            'MsgType': comStr.MsgType.kGetFileUrl,
                                            'FileMD5': fileMD5.toString(),
                                            'ErrorCode': errorCode,
                                            'DownloadURL': fileList
                                        };
                                    } else {
                                        errorCode = -3; //压缩失败
                                        resJson = {
                                            'MsgType': comStr.MsgType.kGetFileUrl,
                                            'ErrorCode': errorCode
                                        };
                                    }
                                    callback("ok", JSON.stringify(resJson));
                                });
                                return;
                            }

                            var tmpFileList = comFunc.readFileList(outputDir, fileList, outputDir);

                            var resJson = {
                                'MsgType': comStr.MsgType.kGetFileUrl,
                                'FileMD5': fileMD5.toString(),
                                'ErrorCode': errorCode,
                                'DownloadURL': fileList
                            };
                            if (fileList.length == 0) {
                                errorCode = -2;
                                resJson = {
                                    'MsgType': comStr.MsgType.kGetFileUrl,
                                    'ErrorCode': errorCode
                                };
                            }
                            //console.log(resJson);
                            callback("ok", JSON.stringify(resJson));
                        } else {
                            callback('invalid_req_param', JSON.stringify({
                                'MsgType': comStr.MsgType.kGetFileUrl,
                                'ErrorCode': -1
                            }));
                        }
                        break;
                    case comStr.MsgType.kVerifyPassword:
                        var password = jsonTxt['Pwd'];
                        var fileExtType = jsonTxt['FromFileType'];
                        if ((password == undefined || password == null || password == "") || (fileExtType == undefined || fileExtType == null)) {
                            callback("invalid_req_param", JSON.stringify({
                                'MsgType': comStr.MsgType.kVerifyPassword,
                                'ErrorCode': -1
                            }));
                            return;
                        }
                        /// pdf路径 
                        var fileWorkPath = GetTaskWorkDir(fileMD5)

                        var fileNameWithExt = fileMD5 + '.' + GetFileExt(jsonTxt['FromFileType']);
                        var srcFilePath = path.join(fileWorkPath, fileNameWithExt);
                        if (!fs.existsSync(srcFilePath)) {
                            callback("invalid_req_param", JSON.stringify({
                                'MsgType': comStr.MsgType.kVerifyPassword,
                                'ErrorCode': -1
                            }));
                            return;
                        }

                        var fileNameDecryptWithExt = 'decrypt_' + fileMD5 + '.' + GetFileExt(jsonTxt['FromFileType']);
                        var outputFilePath = path.join(fileWorkPath, fileNameDecryptWithExt);
                        if (fs.existsSync(outputFilePath)) {
                            fs.unlinkSync(outputFilePath);
                        }

                        var cmdJSON = ["--decrypt", "--password=" + password, srcFilePath, outputFilePath];
                        ExcuteCmd(pdfTool, comStr.MsgType.kVerifyPassword, fileMD5, cmdJSON, function (err) {
                            var hasCallBack = 0;
                            if (err != undefined && err != "") {
                                if (err.indexOf("invalid password") != -1) {
                                    var resJON = {
                                        'MsgType': comStr.MsgType.kVerifyPassword,
                                        'ErrorCode': -2
                                    };
                                    console.log(resJON);
                                    callback("fail", JSON.stringify(resJON));
                                    hasCallBack = 1;
                                }
                            }

                            if (hasCallBack == 0) {
                                callback("ok", JSON.stringify({
                                    'MsgType': comStr.MsgType.kVerifyPassword,
                                    'ErrorCode': 0
                                }))
                            }
                        });
                        break;
                    case comStr.MsgType.kCheckFileExist:
                        var fileExtType = jsonTxt['FromFileType'];
                        if (fileExtType == undefined || fileExtType == null) {
                            callback("invalid_req_param", JSON.stringify({
                                'MsgType': comStr.MsgType.kCheckFileExist,
                                'ErrorCode': -1
                            }));
                            return;
                        }
                        /// pdf路径 
                        var fileWorkPath = GetTaskWorkDir(fileMD5)

                        var fileNameWithExt = fileMD5 + '.' + GetFileExt(jsonTxt['FromFileType']);
                        var srcFilePath = path.join(fileWorkPath, fileNameWithExt);
                        if (!fs.existsSync(srcFilePath)) {
                            callback("invalid_req_param", JSON.stringify({
                                'MsgType': comStr.MsgType.kCheckFileExist,
                                'ErrorCode': -2
                            }));
                            return;
                        }
                        callback("ok", JSON.stringify({
                            'MsgType': comStr.MsgType.kCheckFileExist,
                            'ErrorCode': 0
                        }));
                        break;
                    default:
                        callback("ok", JSON.stringify({
                            'MsgType': comStr.MsgType.kInit,
                            'ErrorCode': -1,
                            'ErrorMsg': 'msgType invalid'
                        }));
                        break;
                }
            } catch (error) {
                console.log(error);
                callback('fail', JSON.stringify({
                    'MsgType': comStr.MsgType.kInit,
                    'ErrorCode': -100,
                    'ErrorMsg': 'msgType invalid'
                }))
            }
        })
    };

    return $;
};