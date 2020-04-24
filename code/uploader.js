var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Stream = require('stream').Stream;

module.exports = flow = function(uploadtmpdir,uploadmd5path) {
  var $ = this;
  $.uploadtmpdir = uploadtmpdir;
  $.uploadmd5dir = uploadmd5path
  $.md5Dir = __dirname + '\\..\\' +  $.uploadmd5dir + '\\'
  $.tmpDir = __dirname + '\\..\\' +  $.uploadtmpdir + '\\'
  $.maxFileSize = null;
  $.fileParameterName = 'file';
  $.fileList = {}
  try {
    mkdirsSync($.uploadtmpdir)
    mkdirsSync($.uploadmd5dir)
  } catch (e) {}

  // 递归创建目录 同步方法
  function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }


  function cleanIdentifier(identifier) {
    return identifier.replace(/[^0-9A-Za-z_-]/g, '');
  }

  function getChunkFilename(chunkNumber, identifier) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);
    // What would the file name be?
    return path.resolve($.tmpDir, './' + identifier + '.' + chunkNumber);
  }

  function validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);

    // Check if the request is sane
    if (chunkNumber == 0 || chunkSize == 0 || totalSize == 0 || identifier.length == 0 || filename.length == 0) {
      return 'non_uploader_request';
    }
    var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
    if (chunkNumber > numberOfChunks) {
      return 'invalid_uploader_request1';
    }

    // Is the file too big?
    if ($.maxFileSize && totalSize > $.maxFileSize) {
      return 'invalid_uploader_request2';
    }

    if (typeof(fileSize) != 'undefined') {
      if (chunkNumber < numberOfChunks && fileSize != chunkSize) {
        // The chunk in the POST request isn't the correct size
        return 'invalid_uploader_request3';
      }
      if (numberOfChunks > 1 && chunkNumber == numberOfChunks && fileSize != ((totalSize % chunkSize) + parseInt(chunkSize))) {
        // The chunks in the POST is the last one, and the fil is not the correct size
        return 'invalid_uploader_request4';
      }
      if (numberOfChunks == 1 && fileSize != totalSize) {
        // The file is only a single chunk, and the data size does not fit
        return 'invalid_uploader_request5';
      }
    }

    return 'valid';
  }

  function WriteUplodFile(dest, source, total, start = 0) { // 写文件，多个文件连续写
    // if(start >= total) return
    let size = 0
    let stat = fs.statSync(dest)
    if(stat.isFile()) {
      size = stat.size
      // console.log(size)
      let WSoptions = {
        start: size,
        flags: "r+",
        encoding:null //默认null
      }
      let RSoptions = {
        flags:'r', //默认 'r'
        encoding:null //默认null
      }
      let WStream = fs.createWriteStream(dest,WSoptions)
      let readStream = fs.createReadStream(source[start],RSoptions);
      readStream.pipe(WStream, {end:false})
      readStream.on("end", function() {
        WStream.end()
        if(fs.existsSync(source[start])) {
          fs.unlinkSync(source[start])
        }
        if(++start >= total) {
          return ;
        }
        WriteUplodFile(dest, source, total, start)
      })
    }
  }


  //'found', filename, original_filename, identifier
  //'not_found', null, null, null
  $.get = function(req, callback) {
    var chunkNumber = req.query.chunkNumber;
    var chunkSize = req.query.chunkSize;
    var totalSize = req.query.totalSize;
    var identifier = req.query.identifier;
    var filename = req.query.filename;

    if(this.fileList[identifier] === undefined) {
      this.fileList[identifier] = {}
      this.fileList[identifier].uploadPieces = []
    }
    console.log(this.fileList[identifier].uploadPieces.length)
    if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);
      fs.exists(chunkFilename, function(exists) {
        if(!fs.existsSync($.md5Dir + identifier + '\\' + identifier + ".PDF")){
          let fileStruct = {}
          fileStruct.chunkNumber = chunkNumber
          fileStruct.chunkSize = chunkSize
          fileStruct.chunkFilename = chunkFilename
          let find = false
          let len = this.fileList[identifier].uploadPieces.length
          for(let i = 0;i < len;i++){
            if(this.fileList[identifier].uploadPieces[i].chunkFilename === chunkFilename){
              find = true
              break
            }
          }
          if(!find) {
            this.fileList[identifier].uploadPieces.push(fileStruct)
          }
        }
        if (exists) {
          callback('found', chunkFilename, filename, identifier);
        } else {
          callback('not_found', null, null, null);
        }
      });
    } else {
      callback('not_found', null, null, null);
    }
  };

  $.clearupload = function(req, callback) {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    var postData = '';
    let self = this
    req.on('data', function (chuck) {
        postData += chuck;
    })
    req.on('end', function () {
      console.log(postData);
      var jsonTxt = JSON.parse(postData);
      let identifier = jsonTxt['identifier']
      console.log(identifier)
      if(self.fileList[identifier] !== undefined) {
        for(let i = 0;i < self.fileList[identifier].uploadPieces.length;i++) {
          if(fs.existsSync(self.fileList[identifier].uploadPieces[i].chunkFilename)) {
            fs.unlinkSync(self.fileList[identifier].uploadPieces[i].chunkFilename)
          }
        }
        self.fileList[identifier] = {}
        self.fileList[identifier].uploadPieces = []
      }
      callback()
    })
  }

  //'partly_done', filename, original_filename, identifier
  //'done', filename, original_filename, identifier
  //'invalid_uploader_request', null, null, null
  //'non_uploader_request', null, null, null
  $.post = function(req, callback) {

    var fields = req.body;
    var files = req.files;

    var chunkNumber = fields['chunkNumber'];
    var chunkSize = fields['chunkSize'];
    var totalSize = fields['totalSize'];
    var identifier = cleanIdentifier(fields['identifier']);
    var filename = fields['filename'];
    if (!files[$.fileParameterName] || !files[$.fileParameterName].size) {
      callback('invalid_uploader_request', null, null, null);
      return;
    }

    var original_filename = files[$.fileParameterName]['originalFilename'];
    var validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, files[$.fileParameterName].size);
    if (validation == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);

      // Save the chunk (TODO: OVERWRITE)
      fs.rename(files[$.fileParameterName].path, chunkFilename, function() {
        // Do we have all the chunks?
        var currentTestChunk = 1;
        var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
        var testChunkExists = function() {
          fs.exists(getChunkFilename(currentTestChunk, identifier), function(exists) {
            if (exists) {
              currentTestChunk++;
              if (currentTestChunk > numberOfChunks) {
                let destDir = $.md5Dir + identifier
                let dest = destDir + '\\' + identifier + ".PDF"
                console.log(dest)
                if(!fs.existsSync(dest)) {
                  fs.mkdirSync(destDir)
                  fs.writeFileSync(dest,'');
                }
                let len = this.fileList[identifier].uploadPieces.length
                let strChunkFilename = ''
                let otherChunkFilename = ''
                //我们做文件序号的排序，可能存在文件位置错乱的情况
                for(let i = 0;i < len;i++) {
                  strChunkFilename = getChunkFilename(i+1, identifier)
                  if(this.fileList[identifier].uploadPieces[i].chunkFilename !== strChunkFilename) { //文件序号错乱
                    for (let j = i + 1; j < len; j++) {
                      otherChunkFilename = this.fileList[identifier].uploadPieces[j].chunkFilename
                      if(strChunkFilename === otherChunkFilename) { //找到对应的,进行数据交换
                        let tmp = this.fileList[identifier].uploadPieces[j]
                        this.fileList[identifier].uploadPieces[j] = this.fileList[identifier].uploadPieces[i]
                        this.fileList[identifier].uploadPieces[i] = tmp
                        break
                      }
                    }
                  }
                }
                let files = []
                for(let i = 0;i < len;i++) {
                  files.push(this.fileList[identifier].uploadPieces[i].chunkFilename)
                }
                WriteUplodFile(dest, files, len)
                callback('done', filename, original_filename, identifier);
              } else {
                // Recursion
                testChunkExists();
              }
            } else {
              callback('partly_done', filename, original_filename, identifier);
            }
          });
        };
        testChunkExists();
      });
    } else {
      callback(validation, filename, original_filename, identifier);
    }
  };

  $.clean = function(identifier, options) {
    options = options || {};

    // Iterate over each chunk
    var pipeChunkRm = function(number) {

      var chunkFilename = getChunkFilename(number, identifier);

      //console.log('removing pipeChunkRm ', number, 'chunkFilename', chunkFilename);
      fs.exists(chunkFilename, function(exists) {
        if (exists) {

          // console.log('exist removing ', chunkFilename);
          fs.unlink(chunkFilename, function(err) {
            if (err && options.onError) options.onError(err);
          });

          pipeChunkRm(number + 1);

        } else {

          if (options.onDone) options.onDone();

        }
      });
    };
    pipeChunkRm(1);
  };

  return $;
};
