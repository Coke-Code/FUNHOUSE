const commStr = 
{
    'FileType':
    {
        kPDF : 0,
        kDoc : 1,
        kDocx: 2,
        kPpt : 3,
        kPptx:4,
        kXls : 5,
        kXlsx:6,
        kHtml:7,
        kPng:8,
        kJpg:9,
        kBmp:10,
        kTif:11,
        kgif:12,
        kTxt:13,
    },

    'FileTypeStr':
    {
        kPDF : '.PDF',
        kDoc : '.Doc',
        kDocx: '.docx',
        kPpt : '.ppt',
        kPptx:'.pptx',
        kXls : '.xls',
        kXlsx:'.xlsx',
        kHtml:'.html',
        kPng:'.png',
        kJpg:'.jpg',
        kBmp:'.bmp',
        kTif:'.tif',
        kgif:'.gif',
        kTxt:'.txt',
    },
    
   'MsgType':
    {
        kInit : 0,
        kGetPageCount :1,//VerifyPassword 也用此命令
        kStartConvert : 2,
        kHeartBeat : 3,
        kGetFileUrl : 4,
        kUploadFile : 5,
    },
    'StrXunJie': 'pHuDdunf',
    'UserCacheDirName':'UserFileCacheDir'    
};

module.exports = commStr;