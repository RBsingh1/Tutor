const multer = require('multer')
const path = require('path');


//IMAGE STORAGE
const Storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, "uploads/")
    },
    filename : function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
    })

const upload = multer({
    storage : Storage,
    fileFilter : function(req, file, callback) {
        if(
            file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"
            
        ){
            callback(null, true)
        }else {
            console.log("only jpg, jpeg and png file supported!")
            callback (null, false)
        }
    },
    // limits : {
    //     fileSize: 1024 * 1024 * 2
    // }
}).single('student_photo')

module.exports = upload
