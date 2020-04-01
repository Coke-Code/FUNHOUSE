//process.env.TMPDIR = 'upload'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var uploader = require('./code/uploader.js')('UserFileCacheDir/tmp','UserFileCacheDir');
var pdfConvertMgr = require('./code/pdfConvertMg.js')();
var app = express();

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = true;

// Host most stuff in the public folder
app.use(express.static(__dirname + '/public'));

// Handle uploads through Uploader.js
app.post('/upload', multipartMiddleware, function(req, res) {
  uploader.post(req, function(status, filename, original_filename, identifier) {
    // console.log('POST', status, original_filename, identifier);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "content-type")
    }
    setTimeout(function () {
      res.send(status);
    }, 500);
  });
});

app.post('/IMyFoneGateway/PDFConvert', function(req, res){
  console.log('index post');
  var bodyR = req.body;
  console.log(bodyR);
  var str = pdfConvertMgr.Init(req, function(err,resStr){
    console.log(resStr);
    //setTimeout(function (str) {
      res.status(200).send(resStr);
    //}, 500);
  });
  res.status(200).json({MsgType:1,ErrorCode:0,PageCount:-1})
  // console.log('index post');
  // var bodyR = req.body;
  // console.log(bodyR);
  // var str = pdfConvertMgr.Init(req, function(str){
  //   setTimeout(function () {
  //     res.status(200).send(str);
  //   }, 500);
  // });
  // res.status(200).send("hello world");
});

app.get('/IMyFoneGateway/PDFConvert', function(req, res){
  //测试
  res.status(200).json({MsgType:1,ErrorCode:0,PageCount:-1})
  // console.log('index');
  // //console.log(pdfConvertMgr);
  // console.log(uploader);
  // debugger;
  // var str = pdfConvertMgr.TestLog('ooookkkk');
  // res.status(200).send("hello world");
});

app.options('/upload', function(req, res){
  console.log('OPTIONS');
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type")
  }
  res.status(200).send();
});
// app.options('/upload', function(req, res){
//   console.log('OPTIONS');
//   if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "content-type")
//   }
//   res.status(200).send();
// });

// Handle status checks on chunks through Uploader.js
app.get('/upload', function(req, res) {
  uploader.get(req, function(status, filename, original_filename, identifier) {
    // console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(status == 'found' ? 200 : 204).send(status);
  });
});

app.get('/download/:identifier', function(req, res) {
  uploader.write(req.params.identifier, res);
});

app.listen(34565);
