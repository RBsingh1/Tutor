const express = require("express")
const router = express.Router()
const Notice = require("../models/noticeBoard")
const checkToken = require('../middleware/check-token');

//Create Notice Board
router.post("/notice/add",checkToken, async(req, res)=>{
    try{
        const notice = await new Notice({
                notice:req.body.notice,
                status:req.body.status,
        })
        notice.save()
        return res.status(200).json({success:true, data:notice})
    }catch(err){
        return res.status(401).json({success:false, msg:err.message})
    }
})

//Read Notice Board News
router.get('/notice/list', checkToken, async (req, res) => {
    try {
        const result = await Notice.find();
        return res.status(200).json({
            success: true,
            status: 200,
            count: result.length,
            msg: 'Notice Board List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});

//NoticeBoard get by id
//Read Notice Board News
router.get('/notice/list/:_id', checkToken, async (req, res) => {
    const _id = req.params._id
    try {
        const result = await Notice.find({_id});
        return res.status(200).json({
            success: true,
            status: 200,
            count: result.length,
            msg: 'Notice Board List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});




//NoticeBoard Edit
router.patch('/notice/update/:_id', checkToken, (req, res, next) => {

    Notice.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});


//Delete Notice Board
router.delete('/notice/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Notice.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});


module.exports = router