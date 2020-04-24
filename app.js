//process.env.TMPDIR = 'upload'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var uploader = require('./code/uploader.js')('UserFileCacheDir/tmp','UserFileCacheDir');
var pdfConvertMgr = require('./code/pdfConvertMg.js')();
var app = express();
const fs = require('fs')

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = true;

// Host most stuff in the public folder
app.use(express.static(__dirname + '/public'));

// Handle uploads through Uploader.js
app.post('/IMyFoneGateway/PDFConvert/upload', multipartMiddleware, function(req, res) {
  uploader.post(req, function(status, filename, original_filename, identify) {
    // console.log('POST', status, original_filename, identify);
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
  //console.log('Accept post');
  var str = pdfConvertMgr.Init(req, function(err,resStr){
      //console.log(resStr);
      res.status(200).send(resStr);
  });
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

app.options('/IMyFoneGateway/PDFConvert/upload', function(req, res){
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
app.get('/IMyFoneGateway/PDFConvert/upload', function(req, res) {
  uploader.get(req, function(status, filename, original_filename, identify) {
    // console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(status == 'found' ? 200 : 204).send(status);
  });
});

app.post('/IMyFoneGateway/PDFConvert/clearupload',function(req, res, next){
  uploader.clearupload(req, function() {
    res.status(200).send('ok')
  })
})

app.get('/IMyFoneGateway/PDFConvert/download',function(req, res, next){
  let identify = req.query.identify
  let filename = req.query.filename
  if (identify === undefined || filename === undefined) {
    res.set("Content-type","text/html");
    res.send("error");
    res.end();
  } else {
    let currFile = `${__dirname}/UserFileCacheDir/${identify}/output/${filename}`
    console.log(currFile)
    if (fs.existsSync(currFile)){
      let stat = fs.statSync(currFile)
      res.set({
        "Content-type":"application/octet-stream",
        "Content-Disposition":"attachment;filename="+encodeURI(filename),
        "Content-length" : stat.size
      });
      fReadStream = fs.createReadStream(currFile);
      fReadStream.on("data",function(chunk){res.write(chunk,"binary")});
      fReadStream.on("end",function () {
          res.end();
      });
    }else{
      res.set("Content-type","text/html");
      res.send("error");
      res.end();
    }
  }
});
app.listen(34565);
