var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Stream = require('stream').Stream;

var querystring = require('querystring');
var exec = require('child_process').execFile;

var userFileCacheDirName = 'UserFileCacheDir';

  var kInit = '0';
  var kGetPageCount = '1';
  var kStartConvert = '2';
  var kHeartBeat = '3';
  var kGetFileUrl = '4';
  var kUploadFile = '5';

module.exports = xx = function() {
    var $ = this;

    function loadIni(filename) {
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

    const iopath = path.join(__dirname, '../tool/Config/0330doc.ini'); 
    var Info = loadIni(iopath)['progress'];
    var prg = Info['progress'];
    console.log(prg);

    var pdfConsoleExe = path.resolve(__dirname,'../tool/PDFConsole.exe');
    console.log(pdfConsoleExe);

    try {
        fs.mkdirSync(userFileCacheDirName);
    } catch (e) {}

    function ExcuteCmd(cmdJson,callback){
        console.log("fun() start");
        exec(pdfConsoleExe,cmdJson, function(err, data) {
              console.log(err)
              console.log(data.toString()); 
              callback(data.toString());                      
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
                case kInit:
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
                case kGetPageCount:
                    //userFileCacheDir/md5/md5.pdf
                    var cmdGetPageCount = ['C:/PDFConvert/tool/2.pdf'];
                    ExcuteCmd(cmdGetPageCount,function(pageNum){
                        var resJON = {'MsgType':kGetPageCount,'ErrorCode':0,'PageCount':pageNum};
                        callback(resJson);
                    });
                    break;
                case kStartConvert:
                    /// 计算md5(pdf路径+pHuDdunf+{年月日})
                    /// 获取转换类型字符串
                    /// pdf路径 
                    /// 转换结果输出目录
                    /// 转换过程ini文件，其记录了进度
                    /// 转换页数范围
                    /// 目标文件后缀，通过ToFileType获取
                    /// 原文件密码
                    var cmdJSON = ['ecbf0e75ccbf13490b84bc6d92bd63dc', 'file2word', 'C:/PDFConvert/tool/2.pdf', 'C:/PDFConvert/tool/output', 'C:/PDFConvert/tool/Config/0330doc.ini', '1-9999', 'doc'];
                    ExcuteCmd(cmdJSON,function(pageNum){
                        var resJON = {'MsgType':kStartConvert,'ErrorCode':0};
                        callback(resJson);
                    });
                    break;
                case kHeartBeat:
                    /// 读取MD5的文件相应的ini解析其中progress并返回给客户端
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