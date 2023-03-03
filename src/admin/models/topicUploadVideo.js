const multer = require('multer')
const path = require('path');


//IMAGE STORAGE
const Storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, "Images/topicVideos/")
    },
    filename : function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
    })
const maxSize = 10 * 1024 * 1024
const upload2 = multer({
    storage : Storage,
    limits:{fileSize: maxSize},
     fileFilterVideo : (req, file, cb) => {
        if(file.mimetype === 'video/mp4'){
            cb(null,true);
        }else{
            cb({message: 'Unsupported File Format'}, false)
        }
    },
    
    // limits : { 
    //     fileSize: 1048576, //10mb
    // }
}).single('upload_video')  //field name where this image/pdf file save in database

module.exports = upload2
