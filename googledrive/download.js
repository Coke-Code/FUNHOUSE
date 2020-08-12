var request = require('request');
var fs = require('fs');

/*
* url 网络文件地址
* filename 文件名
* callback 回调函数
*/
function downloadFile(uri,filename,callback){
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback); 
}

var fileUrl  = "https://dl.dropboxusercontent.com/1/view/bi63e7y1gjindbg/Get%20Started%20with%20Dropbox.pdf";
var filename = '测试.pdf';  //文件名
downloadFile(fileUrl,filename,function(){
    console.log(filename+'下载完毕');
});