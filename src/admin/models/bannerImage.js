const multer = require('multer')
const path = require('path');


//IMAGE STORAGE
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Images/bannerImage/")
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: Storage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"

        ) {
            callback(null, true)
        } else {
            console.log("only jpg, jpeg and png file supported!")
            callback(null, false)
        }
    },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
      }
    // limits : {
    //     fileSize: 1024 * 1024 * 2
    // }
}).single('banner_image') //where you want to save image
    // upload(req, res, function (err) {
    // if (err instanceof multer.MulterError) {
    //     // A Multer error occurred when uploading.
    // } else if (err) {
    //     // An unknown error occurred when uploading.
    // }
    // Everything went fine. 
//     next()
// })

module.exports = upload
