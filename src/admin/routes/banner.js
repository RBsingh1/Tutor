require('dotenv').config(); //get env variables

const express   = require('express'); 
const banner = require("../models/banner")
const upload = require("../models/bannerImage")
// const mongoose  = require('mongoose'); 
const auth= require('../middleware/check-token'); 
const router    = express.Router(); 

// **** All List **** //
router.get('/test_api', async (req, res) => {
    try{
        const result = await banner.find(); 
        return res.status(200).json({
            status:200,
            count: result.length,
            msg:'Banner List',
            data: result
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

// **** All List **** //
router.get('/banner/list', auth, async (req, res) => {
    try{
        const result = await banner.find(); 
        return res.status(200).json({
            success:true,
            count: result.length,
            msg:'Banner List',
            data: result
        })
    }
    catch(error){
        res.status(500).json({success:false, message: error.message})
    }
});

// ** Add banner ** //
router.post('/banner/add', auth, upload, async (req, res) => {
    if (req.file) {
        banner_image = req.file.path
    }
    try {
        const data = new banner({
            banner_title: req.body.banner_title,
            banner_status: req.body.banner_status,
            banner_image: "https://tutoradminapi2.onrender.com/" +req.file.path,
            addedat: new Date()
        })
        data
            .save()
            .then(result => {
                res.status(200).json({
                    success: true,
                    message: 'data stored!'
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err
                });
            })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


//banner Edit
router.patch('/banner/update/:_id', auth, upload, async (req, res, next) => {
    const _id = req.params._id;

    if (req.file == '' || req.file == undefined) {
        banner_image = req.body.banner_image
    }else{
        banner_image = "https://tutoradminapi2.onrender.com/" +req.file.path
    }
    try {
        await banner.findByIdAndUpdate({ _id }, {
            $set: {
                banner_title: req.body.banner_title,
                banner_status: req.body.banner_status,
                banner_image: banner_image,
            },
        }), res.send({ success: true, msg: "Update successfull" });
        // banner_image: "http://3.140.242.2:3000/"+req.file.path,

    } catch (error) {
        return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
    }
})



//Delete a row 
router.delete('/banner/delete/:_id',auth, (req, res, next)=>{
    const id = req.params._id;
    banner.deleteOne({ _id : id })
    .exec()
    .then( result => {
        console.log(result)
        res.status(200).json({success:true,result});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({success:false,error:err});
    });
});

module.exports = router;
