const multer = require('multer')
const path = require('path');


//IMAGE STORAGE
const Storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, "Images/chatImage/")
    },
    filename : function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
    })

const upload = multer({
    storage : Storage,
    fileFilter : function(req, file, cb) {
        switch (file.mimetype) {
            case 'image/jpg':
                 cb(null, './samplefile/');
                 break;
            case 'image/jpeg':
                 cb(null, './samplefile/');
                 break;
            case 'image/png':
                 cb(null, './samplefile/');
                 break;
            case 'application/pdf':
                 cb(null, './samplefile/');
                 break;
            default:
                 cb('only jpg, png, jpeg and pdf file supported!');
                 break;
       }
    },
    // limits : {
    //     fileSize: 1024 * 1024 * 2
    // }
}).single('Image')  //field name where this image/pdf file save in database

module.exports = upload
