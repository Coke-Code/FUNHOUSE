var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Stream = require('stream').Stream;

var querystring = require('querystring');
var exec = require('child_process').execFile;
var crypto = require('crypto');
var sd = require('silly-datetime');

var loadiniY = require('./iniParse')
var comStr = require('./commomStr')

var userFileCacheDirName = comStr.UserCacheDirName;


module.exports = xx = function() {
    var $ = this;
    var pdfConsoleExe = path.resolve(__dirname,'../tool/PDFConsole.exe');
    console.log(pdfConsoleExe);

    try {
        fs.mkdirSync(userFileCacheDirName);
    } catch (e) {}

    function ExcuteCmd(cmdJson,callback){
        console.log("fun() start");
        exec(pdfConsoleExe,cmdJson, function(err, data) {
            if (err) {
                callback(err);
            } else {
                console.log(err)
                console.log(data.toString()); 
            }                     
          });
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

    function GetProgress(iniPath)
    {
        var loadXX = new loadiniY(iniPath);
        var Info = loadXX['progress'];
        var prg = Info['progress'];
        console.log(prg);
        return prg;
            // const iopath = path.join(__dirname, '../tool/Config/0330doc.ini');
        // fs.exists(iniPath,function(exist){
        //     if (exist) {
                
        //     }
        //     else
        //     {
        //         return 0;
        //     }
        // });
        
    }

    $.Init = function(req, callback) {

        var postData = '';
        // 18. 给req对象注册一个接收数据的事件
        req.on('data',function (chuck) {  
            /**data事件详解
             * 浏览器每发送一次数据包（chuck），该函数会调用一次。
             * 该函数会调用多次，调用的次数是由数据和网速限制的
             */
            // 19. 每次发送的都数据都叠加到postData里面
            postData += chuck;
        })
        // 20. 到post请求数据发完了之后会执行一个end事件，这个事件只执行一次
        req.on('end', function () {
            // 21. 此时服务器成功接受了本次post请求的参数
            // post请求最终获取到的数据就是url协议组成结构中的query部分
            console.log(postData);
            var jsonTxt = JSON.parse(postData);
            console.log(jsonTxt);
            // 22. 使用querystring模块来解析post请求
            /**
             * querystring详解
             * 参数：要解析的字符串
             * 返回值：解析之后的对象。
             */
            var postObjc = querystring.parse(postData);
            // 23. 打印出post请求参数，
            console.log(postObjc);
            var msgType = jsonTxt['MsgType'];
            switch(msgType)
            {
                case comStr.MsgType.kInit:
                    var res = Init(jsonTxt);
                    if(res == 'OK')
                    {
                        var resJson = {'MsgType':kInit,'ErrorCode':0};
                        callback(resJson);
                    }
                    else
                    {
                        var resJson = {'MsgType':kInit,'ErrorCode':-1};
                        callback(resJson);
                    }
                    break;
                case comStr.MsgType.kGetPageCount:
                    //userFileCacheDir/md5/md5.pdf
                    var fileMD5 = jsonTxt['FileMD5']
                    if( fileMD5 != undefined )
                    {
                        var fileNameWithExt = fileMD5 + '.PDF';
                        var filePath = path.join(__dirname,'../',userFileCacheDirName,fileMD5,fileNameWithExt);
                        var filePwd = jsonTxt['Pwd'];
                        var cmdGetPageCount = [filePath];
                        if(filePwd != undefined)
                        {
                            cmdGetPageCount = [filePath,filePwd];
                        }
                        ExcuteCmd(cmdGetPageCount,function(pageNum){
                            var resJON = {'MsgType':comStr.MsgType.kGetPageCount,'ErrorCode':0,'PageCount':Number(pageNum)};
                            console.log(resJON);
                            var strJson = JSON.stringify(resJON);
                            console.log(strJson);
                            callback("ok",strJson);
                        });
                    }
                    else
                    {
                        callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kGetPageCount,'ErrorCode':-1,'PageCount':-3}));
                    }
                    break;
                case comStr.MsgType.kStartConvert:
                    var fileMD5 = jsonTxt['FileMD5']
                    if( fileMD5 != undefined )
                    {
                        /// 计算md5(pdf路径+pHuDdunf+{年月日})
                        var pathMD5 = GetPathMD5(fileMD5);
                        /// 获取转换类型字符串
                        var taskType = GetTaskType(jsonTxt['FromFileType'],jsonTxt['ToFileType']);
                        /// pdf路径 
                        var fileWorkPath = path.join(__dirname,'../',userFileCacheDirName,fileMD5);
                        var fileNameWithExt = fileMD5 + GetFileExt(jsonTxt['FromFileType']);
                        var srcFilePath = path.join(fileWorkPath,fileNameWithExt);
                        /// 转换结果输出目录
                        var outputFilePath = path.join(fileWorkPath,"output");
                        /// 转换过程ini文件，其记录了进度
                        var progFileName = fileMD5 + '_' + 'progress.ini';
                        var progressIniPath = path.join(fileWorkPath,progFileName);
                        /// 转换页数范围
                        var pageRange = jsonTxt['PageRange'];
                        /// 目标文件后缀，通过ToFileType获取
                        var dstFileExt = GetFileExt(jsonTxt['ToFileType']);
                        /// 原文件密码
                        var filePwd = jsonTxt['Pwd'];
                        var cmdJSON = [pathMD5, taskType, srcFilePath, outputFilePath, progressIniPath, pageRange==undefined?'':pageRange, dstFileExt,filePwd==undefined?'':filePwd];
                        let hasErr = 0;
                        ExcuteCmd(cmdJSON,function(err){
                            if(err != undefined){
                                var resJON = {'MsgType':comStr.MsgType.kStartConvert,'ErrorCode':-1};
                                callback("fail",JSON.stringify(resJON));
                                hasErr = 1;
                            }
                        });
                        if (hasErr === 0) {
                            var resTestJson = {'MsgType':comStr.MsgType.kStartConvert,'ErrorCode':0};
                            callback("ok",JSON.stringify(resTestJson));                            
                        }
                    }
                    else
                    {
                        callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kStartConvert,'ErrorCode':-1}));
                    }
                    break;
                case comStr.MsgType.kHeartBeat:
                    /// 读取MD5的文件相应的ini解析其中progress并返回给客户端
                    var fileMD5 = jsonTxt['FileMD5'];
                    if(fileMD5 != undefined)
                    {
//｛
//     MsgType:HeartBeat
//     FileMD5:xxx (字符串)   
//     Progress：100（1-100）
//     ConvertDone: 1 (数据 0 ，1表示完成)
// ｝
                        var fileWorkPath = path.join(__dirname,'../',userFileCacheDirName,fileMD5);
                        var progFileName = fileMD5 + '_' + 'progress.ini';
                        var progressIniPath = path.join(fileWorkPath,progFileName);
                        var progress = GetProgress(progressIniPath);
                        console.log(process);
                        var convertDone = 0;
                        if(process == '100')
                        {
                            convertDone = 1;
                        }
                        var resJson = {'MsgType':comStr.MsgType.kHeartBeat,'FileMD5':fileMD5,'Progress':Number(progress),'ConvertDone':convertDone};
                        callback("ok",JSON.stringify(resJson));
                    }
                    else
                    {
                        callback('invalid_req_param',JSON.stringify({'MsgType':comStr.MsgType.kHeartBeat,'ErrorCode':-1}));
                    }
                    break;
                default:
                    break;                   
            }
        })

        // var fields = req.body;
        // var files = req.files;

        // // MsgType: Init（枚举值）
        // // FileMD5:xxx (字符串)
        // // FileSize:1024 (数值，单位byte)
        // // FromFileType: PDF(枚举值)
        // var chunkNumber = fields['MsgType'];
        // var chunkSize = fields['FileMD5'];
        // var totalSize = fields['FileSize'];
        // var identifier = cleanIdentifier(fields['FromFileType']);
        // var filename = fields['ToFileType'];
        // console.log(fields);
    };

    return $;
};