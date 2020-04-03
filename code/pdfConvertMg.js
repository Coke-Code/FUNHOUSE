var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Stream = require('stream').Stream;

var querystring = require('querystring');
var exec = require('child_process').execFile;
var crypto = require('crypto');
var sd = require('silly-datetime');

var comFunc = require('./commonFunc')()
var comStr = require('./commomStr')

var userFileCacheDirName = comStr.UserCacheDirName;
var taskMap = new Map();

module.exports = xx = function() {
    var $ = this;
    var pdfConsoleExe = path.resolve(__dirname,'../tool/PDFConsole.exe');
    console.log(pdfConsoleExe);

    try {
        fs.mkdirSync(userFileCacheDirName);
    } catch (e) {}

    function ExcuteCmd(taskType,taskMD5,cmdJson,callback){
        console.log("fun() start");
        let child = exec(pdfConsoleExe,cmdJson, function(err, data) {
            console.log(err)
            console.log(data.toString()); 
            callback(data.toString());               
          });
          if(taskType == comStr.MsgType.kStartConvert){
              taskMap.set(taskMD5,child);
              console.log("Add Current TaskMapSize:"+taskMap.size);
          }
          console.log(child);
    }

    function Init(jsonTxt){
        var fileMD5 = jsonTxt['FileMD5'];
        var fileUserFilePath = path.join(__dirname,userFileCacheDirName,fileMD5);
        console.log(fileUserFilePath);
        try {
            fs.mkdirSync(fileUserFilePath,{ recursive: true },(err) => {
                if (err) throw err;
            });
        } catch (e) {
            console.log('make dir fail' + fileUserFilePath);
        }

        try {
            var fileUserFileInfo = path.join(fileUserFilePath,'info.json');
            fs.writeFile(fileUserFileInfo,jsonTxt,function(err){
                if(err)
                {
                    console.log(err);
                }
            })
        } catch (error) {
            
        }
        
        return 'OK';
    }

    function GetPathMD5(fileMD5)
    {
        var fileNameWithExt = fileMD5 + '.PDF';
        var filePath = path.join(__dirname,'../',userFileCacheDirName,fileMD5,fileNameWithExt);
        var time = sd.format(new Date(), 'YYYYMMDD');
        var combineStr = filePath + comStr.StrXunJie + time;
        var m = crypto.createHash('md5');
        m.update(combineStr, 'utf8');
        var pathMD5 = m.digest('hex');
        return pathMD5;
    }

    function GetTaskType(fromType,toType)
    {
        if (fromType == comStr.FileType.kPDF)
        {
            if (toType == comStr.FileType.kDoc || toType == comStr.FileType.kDocx)
            {
                return "file2word";
            }
    
            if (toType == comStr.FileType.kXls || toType == comStr.FileType.kXlsx)
            {
                return "file2excel";
            }
    
            if (toType == comStr.FileType.kPpt || toType == comStr.FileType.kPptx)
            {
                return "file2ppt";
            }
    
            if (toType == comStr.FileType.kPng || toType == comStr.FileType.kJpg || 
                toType == comStr.FileType.kBmp || toType == comStr.FileType.kTif ||
                toType == comStr.FileType.kgif)
            {
                return "file2img";
            }
    
            if (toType ==comStr.FileType.kXls || toType == comStr.FileType.kXlsx)
            {
                return "file2html";
            }
    
            if (toType == comStr.FileType.kTxt)
            {
                return "file2txt";
            }
        }
    
        if (toType == comStr.FileType.kPDF)
        {
            if (fromType == comStr.FileType.kPng || fromType == comStr.FileType.kJpg ||
                fromType == comStr.FileType.kBmp || fromType == comStr.FileType.kTif ||
                fromType == comStr.FileType.kgif)
            {
                return "img2pdf";
            }
    
            return "file2pdf";
        }
    
        return "file2word";
    }

    function GetFileExt(FileType)
    {
        if (FileType == comStr.FileType.kPDF) {
            return comStr.FileTypeStr.kPDF;
        } 
        else if (FileType == comStr.FileType.kDoc) {
            return comStr.FileTypeStr.kDoc;
        }
        else if (FileType == comStr.FileType.kDocx) {
            return comStr.FileTypeStr.kDocx;
        }

        return comStr.FileTypeStr.kPDF;
    }

    function GetProgress(iniPath) {
        try {
            var loadObj = comFunc.loadIni(iniPath);
            var Info = loadObj['progress'];
            var prg = Info['progress'];
            //console.log(prg);
            return prg.toString();            
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    function GetTaskWorkDir(taskMD5) {
        return path.join(__dirname,'../',userFileCacheDirName,taskMD5);
    }

    function GetTaskIniProgress(taskMD5){
        let progressIniName = taskMD5+ '_' + 'progress.ini';
        return path.join(GetTaskWorkDir(taskMD5),progressIniName);
    }

    function GetTaskOutputDir(taskMD5){
        return path.join(GetTaskWorkDir(taskMD5),'output');
    }

    $.Init = function(req, callback) {

        var postData = ''; 
        req.on('data',function (chuck) {  
            postData += chuck;
        })

        req.on('end', function () {
            try {
                console.log(postData);
                var jsonTxt = JSON.parse(postData);
                console.log(jsonTxt);                
            } catch (error) {
                var resJson = {'MsgType':comStr.MsgType.kInit,'ErrorCode':-1,'ErrorMsg':'post data invalid'};
                callback('fail',JSON.stringify(resJson));
            }

            try {
                var msgType = jsonTxt['MsgType'];
                var fileMD5 = jsonTxt['FileMD5']
                switch(msgType) {
                    case comStr.MsgType.kInit:
                        var resJson = {'MsgType':comStr.MsgType.kInit,'ErrorCode':-1,'ErrorMsg':'msgType invalid'};
                        callback('fail',JSON.stringify(resJson));
                        break;
                    case comStr.MsgType.kGetPageCount:
                        if( fileMD5 != undefined ) {
                            var fileNameWithExt = fileMD5 + GetFileExt[jsonTxt['FromFileType']];
                            var filePath = path.join(GetTaskWorkDir(fileMD5),fileNameWithExt);
                            if(fs.existsSync(filePath)){
                                console.log(fileMD5);
                                console.log(fs.statSync(filePath).size);
                            } else {
                                console.log(fileMD5 + 'NOT Exist');
                            }
    
                            var filePwd = jsonTxt['Pwd'];
                            var cmdGetPageCount = [filePath];
                            if(  filePwd != null && filePwd != undefined && filePwd != "") {
                                cmdGetPageCount = [filePath,filePwd];
                            }
    
                            ExcuteCmd(comStr.MsgType.kGetPageCount,fileMD5, cmdGetPageCount,function(pageNum){
                                var resJON = {'MsgType':comStr.MsgType.kGetPageCount,'ErrorCode':0,'PageCount':Number(pageNum)};
                                console.log(resJON);
                                var strJson = JSON.stringify(resJON);
                                console.log(strJson);
                                callback("ok",strJson);
                            });
                        }
                        else {
                            callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kGetPageCount,'ErrorCode':-1,'PageCount':-3}));
                        }
                        break;
                    case comStr.MsgType.kStartConvert:
                        if( fileMD5 != undefined ){
                            /// 计算md5(pdf路径+pHuDdunf+{年月日})
                            var pathMD5 = GetPathMD5(fileMD5);
                            /// 获取转换类型字符串
                            var taskType = GetTaskType(jsonTxt['FromFileType'],jsonTxt['ToFileType']);
                            /// pdf路径 
                            var fileWorkPath = GetTaskWorkDir(fileMD5)                      
    
                            var fileNameWithExt = fileMD5 + GetFileExt(jsonTxt['FromFileType']);
                            var srcFilePath = path.join(fileWorkPath,fileNameWithExt);
                            /// 转换结果输出目录
                            var outputFilePath = GetTaskOutputDir(fileMD5);
                            if(fs.existsSync(outputFilePath)) {
                                comFunc.deleteFolderRecursive(outputFilePath);
                            }
                            /// 转换过程ini文件，其记录了进度
                            var progressIniPath = GetTaskIniProgress(fileMD5);
                            if(fs.existsSync(progressIniPath)) {
                                fs.unlinkSync(progressIniPath);
                            }
                            /// 转换页数范围
                            var pageRange = jsonTxt['PageRange'];
                            /// 目标文件后缀，通过ToFileType获取
                            var dstFileExt = GetFileExt(jsonTxt['ToFileType']);
                            /// 原文件密码
                            var filePwd = jsonTxt['Pwd'];
                            var cmdJSON = [pathMD5, taskType, srcFilePath, outputFilePath, progressIniPath, pageRange==undefined?'':pageRange, dstFileExt,filePwd==undefined?'':filePwd];
    
                            ExcuteCmd(comStr.MsgType.kStartConvert, fileMD5, cmdJSON,function(err){
                                if(err != undefined && err!=""){
                                    var resJON = {'MsgType':comStr.MsgType.kStartConvert,'ErrorCode':-1};
                                    console.log(resJON);
                                    //callback("fail",JSON.stringify(resJON));
                                    //hasErr = 1;
                                }
                            });
                            
                            var resTestJson = {'MsgType':comStr.MsgType.kStartConvert,'ErrorCode':0};
                            callback("ok",JSON.stringify(resTestJson));                            
                            
                        } else {
                            callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kStartConvert,'ErrorCode':-1}));
                        }
                        break;
                    case comStr.MsgType.kHeartBeat:
                        /// 读取MD5的文件相应的ini解析其中progress并返回给客户端
                        if(fileMD5 != undefined) {
                            var progressIniPath = GetTaskIniProgress(fileMD5);
                            var progress = GetProgress(progressIniPath);
                            console.log(process);
                            var convertDone = 0;
                            if( Number(progress) == 100) {
                                if(taskMap.has(fileMD5)) {                                    
                                    taskMap.delete(fileMD5);
                                    console.log("conVertDone After del cur taskSize=" + taskMap.size);                            
                                }
                                convertDone = 1;
                            }
                            var resJson = {'MsgType':comStr.MsgType.kHeartBeat,'FileMD5':fileMD5,'Progress':Number(progress),'ConvertDone':convertDone};
                            callback("ok",JSON.stringify(resJson));
                        }
                        else {
                            callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kHeartBeat,'ErrorCode':-1}));
                        }
                        break;
                    case comStr.MsgType.kStopConvert:
                        if(fileMD5 != undefined) {
                            if(taskMap.has(fileMD5)) {
                                let child = taskMap.get(fileMD5);
                                child.kill();
                                child.on('exit',function(code,signal){
                                    if(code){
                                        console.log("child exit code:"+code)
                                    }else{
                                        console.log("child exit signal:"+signal)
                                    }     
                                    
                                    taskMap.delete(fileMD5);
                                    console.log("After del cur taskSize=" + taskMap.size);                            
                                });  
    
                                var resJson = {'MsgType':comStr.MsgType.kStopConvert,'ErrorCode':0};
                                callback("ok",JSON.stringify(resJson));
                            }                        
                        } else {
                            callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kHeartBeat,'ErrorCode':-1}));
                        }
                        break;    
                    case comStr.MsgType.kGetFileUrl:
                        var outputDir = GetTaskOutputDir(fileMD5);
                        if (fs.existsSync(outputDir)) {
                            var fileList = [];
                            var tmpFileList = comFunc.readFileList(outputDir,fileList);
                            var resJson = {'MsgType':comStr.MsgType.kGetFileUrl,'FileMD5':fileMD5.toString(),'DownloadURL':fileList};
                            console.log(resJson);
                            callback("ok",JSON.stringify(resJson));
                        } else {
                            callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kGetFileUrl,'ErrorCode':-1}))
                        }
                        break;
                    default:
                        callback("ok",JSON.stringify({'MsgType':comStr.MsgType.kInit,'ErrorCode':-1,'ErrorMsg':'msgType invalid'}));
                        break;                   
                }                
            } catch (error) {
                console.log(error);
                callback('fail',JSON.stringify({'MsgType':comStr.MsgType.kInit,'ErrorCode':-100,'ErrorMsg':'msgType invalid'}))
            }
        })
    };

    return $;
};