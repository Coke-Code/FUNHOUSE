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
        kGif:10,
        kBmp:11,
        kTif:12,
        kTxt:13,
    },

    'FileTypeStr':
    {
        kPDF : 'pdf',
        kDoc : 'doc',
        kDocx: 'docx',
        kPpt : 'ppt',
        kPptx:'pptx',
        kXls : 'xls',
        kXlsx:'xlsx',
        kHtml:'html',
        kPng:'png',
        kJpg:'jpg',
        kGif:'gif',
        kBmp:'bmp',
        kTif:'tif',
        kTxt:'txt',
    },
    
   'MsgType':
    {
        kInvalid : 0,
        kGetPageCount :1,
        kStartConvert : 2,
        kStopConvert:3,
        kHeartBeat : 4,
        kGetFileUrl : 5,
        kUploadFile : 6,
        kVerifyPassword:7,
        kCheckFileExist:8,
    },
    'StrXunJie': 'pHuDdunf',
    'UserCacheDirName':'UserFileCacheDir'    
};

module.exports = commStr;