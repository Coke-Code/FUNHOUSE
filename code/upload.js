const multer = require('multer')
const fs = require('fs')
const path = require('path')

module.exports = {
  multerset: multer({
    dest: './uploads'
  }),
  singlefile: function(req,res,next) { // 单文件上传功能
    console.log('1111')
    if(req.file.length === 0) { // 判断文件是否存在，不存在就直接返回josn数据 - not exist.
      res.set({
        'content-type': 'application/json; charset="utf8'
      })
      res.end('file not exist')
    } else {
        let file = req.file
        let fileInfo = {}
        let fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname) //改名
        fileInfo.originalname = file.originalname
        fileInfo.size = file.size
        fileInfo.path = file.path
        fileInfo.name = fileName

        res.set({
          'content-type': 'application/json; charset=utf-8'
        })
        res.end('upload success')
    }
  },
  miltifile: function(req, res, next) { // 多文件上传功能
    let files = req.files
    if(files.length === 0) {
      res.set({
        'content-type': 'application/json; charset="utf8'
      })
      res.end('file not exist')
    } else {
      let fileInfos = []
      for(let sub in files) {
        let file = files[sub]
        let fileInfo = {}
        let fileName = file.filename + '-' + Date.now() + path.extname(file.originalname) //改名
        fileInfo.originalname = file.originalname
        fileInfo.size = file.size
        fileInfo.path = file.path
        fileInfo.name = fileName
        fileInfos.push(fileInfo)
      }

      res.set({
        'content-type': 'application/json; charset=utf-8'
      })
      res.end('upload success')
    }
  },
  catcherror: function(err, req, res, next) {  // 捕获这个异常
    res.send(err.toString())
  }
}