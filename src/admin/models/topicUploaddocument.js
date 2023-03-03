// const multer = require('multer');

// //specify the storage engine

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "./Images/topicdocument/")
//     },
//     filename:function(req, file, cb){
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

// const storageVideo = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "./Images/topicVideos/")
//     },
//     filename:function(req, file, cb){
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

// // file validation

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'application/pdf' ){
//         cb(null,true);
//     }else{
//         cb({message: 'Unsupported File Format'}, false)
//     }
// };

// const fileFilterVideo = (req, file, cb) => {
//     if(file.mimetype === 'video/mp4'){
//         cb(null,true);
//     }else{
//         cb({message: 'Unsupported File Format'}, false)
//     }
// };


// const uploadPdf = multer({
//     storage: storage,
//     //limits: {fileSize: 4096 * 4096},
//     fileFilter: fileFilter
// }).single('upload_pdf');

// const maxSize = 10 * 1024 * 1024
// const uploadVideo = multer({
//     storage: storageVideo,
//     limits: {fileSize: maxSize},
//     fileFilter: fileFilterVideo
// }).single('upload_video');

// //  const multipleUpload = 
// // {
// //     uploadPdf:uploadPdf.single('upload_pdf'),
// //     uploadVideo:uploadVideo.single('upload_video')
// // }
    
// // const multipleUploadfiles = multipleUpload;

// module.exports = {uploadPdf, uploadVideo};






// const multer = require('multer')
// const path = require('path');


// //IMAGE STORAGE
// const Storage = multer.diskStorage({
//     destination : function(req, file, cb) {
//         if(file.fieldname === 'upload_pdf'){
//             cb(null, "./Images/topicdocument/")
//         }else if(file.fieldname === 'upload_video'){
//             cb(null, "./Images/topicVideos/")
//         }},
//     filename : function(req, file, cb) {
//         let ext = path.extname(file.originalname)
//         cb(null, Date.now() + ext)
//     }
//     })
    
// const maxSize = 10 * 1024 * 1024  //10 mb
// const upload1 = multer({
//     storage : Storage,
//     limits:{fileSize: maxSize},
//     fileFilter : function(req, file, cb) {
//         switch (file.mimetype) {
           
//             case 'application/pdf':
//                  cb(null, './topicdocument/');
//                  break;
//             case 'video/mp4':
//                     cb(null, './topicVideos');
//                     break;
//             default:
//                  cb('only pdf & video file supported!');
//                  break;
//        }
//     },
    
// })
// const multipleUpload = upload1.fields([{name:'upload_pdf',maxCount: 2},{name:'upload_video',maxCount: 2}])

// module.exports = multipleUpload


const multer = require('multer')
const path = require('path');



/** Function for Upload Pdf */
// async function multipleUploadDoc(req, res) {
    const Storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./Images/topicdocument/")
        },
        filename: function (req, file, cb) {
            let ext = path.extname(file.originalname)
            cb(null, Date.now() + ext)
        }
    })
    const upload = multer({
        storage: Storage,
        fileFilterPdf: (req, file, cb) => {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb({ message: 'Only Upload Pdf File' }, false)
            }
        },

    }).single('upload_pdf')  //field name where this image/pdf file save in database
// }
module.exports = upload