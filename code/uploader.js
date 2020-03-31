var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Stream = require('stream').Stream;

module.exports = flow = function(temporaryFolder) {
  var $ = this;
  $.temporaryFolder = temporaryFolder;
  $.maxFileSize = null;
  $.fileParameterName = 'file';
  fileList = {}
  try {
    fs.mkdirSync($.temporaryFolder);
  } catch (e) {}

  function cleanIdentifier(identifier) {
    return identifier.replace(/[^0-9A-Za-z_-]/g, '');
  }

  function getChunkFilename(chunkNumber, identifier) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);
    // What would the file name be?
    return path.resolve($.temporaryFolder, './' + identifier + '.' + chunkNumber);
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
    if(start >= total) return
    let size = 0
    let stat = fs.statSync(dest)
    if(stat.isFile()) {
      size = stat.size
      console.log(size)
      let WSoptions = {
        start: size,
        flags: "r+"
      }
      let WStream = fs.createWriteStream(dest,WSoptions)
      let readStream = fs.createReadStream(source[start]);
      readStream.pipe(WStream, {end:false})
      readStream.on("end", function() {
        WriteUplodFile(dest, source, total, ++start)
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
      this.fileList[identifier] = []
    }
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log(identifier)
    console.log(this.fileList[identifier])
    if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);
      fs.exists(chunkFilename, function(exists) {
        let fileStruct = {}
        fileStruct.chunkNumber = chunkNumber
        fileStruct.chunkSize = chunkSize
        fileStruct.chunkFilename = chunkFilename
        this.fileList[identifier].push(fileStruct)
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
                let dest = __dirname + "\\..\\upload\\" + identifier
                if(!fs.existsSync(dest)) {
                  fs.writeFileSync(dest,'');
                }
                let files = []
                let len = this.fileList[identifier].length
                console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                console.log(identifier)
                for(let i = 0;i < len;i++) {
                  console.log(this.fileList[identifier][i].chunkFilename)
                  files.push(this.fileList[identifier][i].chunkFilename)
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

  // Pipe chunks directly in to an existsing WritableStream
  //   r.write(identifier, response);
  //   r.write(identifier, response, {end:false});
  //
  //   var stream = fs.createWriteStream(filename);
  //   r.write(identifier, stream);
  //   stream.on('data', function(data){...});
  //   stream.on('finish', function(){...});
  $.write = function(identifier, writableStream, options) {
    options = options || {};
    options.end = (typeof options['end'] == 'undefined' ? true : options['end']);

    // Iterate over each chunk
    var pipeChunk = function(number) {

      var chunkFilename = getChunkFilename(number, identifier);
      fs.existsSync(chunkFilename, function(exists) {
        if (exists) {
          // If the chunk with the current number exists,
          // then create a ReadStream from the file
          // and pipe it to the specified writableStream.
          var sourceStream = fs.createReadStream(chunkFilename);
          sourceStream.pipe(writableStream, {
            end: false
          });
          sourceStream.on('end', function() {
            // When the chunk is fully streamed,
            // jump to the next one
            pipeChunk(number + 1);
          });
        } else {
          // When all the chunks have been piped, end the stream
          if (options.end) writableStream.end();
          if (options.onDone) options.onDone();
        }
      });
    };
    pipeChunk(1);
  };

  $.clean = function(identifier, options) {
    options = options || {};

    // Iterate over each chunk
    var pipeChunkRm = function(number) {

      var chunkFilename = getChunkFilename(number, identifier);

      //console.log('removing pipeChunkRm ', number, 'chunkFilename', chunkFilename);
      fs.exists(chunkFilename, function(exists) {
        if (exists) {

          console.log('exist removing ', chunkFilename);
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
