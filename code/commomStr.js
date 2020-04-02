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
        kgif:10,
        kBmp:11,
        kTif:12,
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
        kgif:'.gif',
        kBmp:'.bmp',
        kTif:'.tif',
        kTxt:'.txt',
    },
    
   'MsgType':
    {
        kInit : 0,
        kGetPageCount :1,//VerifyPassword 也用此命令
        kStartConvert : 2,
        kStopConvert:3,
        kHeartBeat : 4,
        kGetFileUrl : 5,
        kUploadFile : 6,
    },
    'StrXunJie': 'pHuDdunf',
    'UserCacheDirName':'UserFileCacheDir'    
};

module.exports = commStr;