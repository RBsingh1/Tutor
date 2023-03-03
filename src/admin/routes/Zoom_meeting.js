const express = require("express")
const router = express.Router()
const Zoom = require("../models/Zoom_meeting")
const Class = require('../models/class');
const Batch = require("../models/batches")
const Session = require("../models/session")
const checktoken = require("../middleware/check-token");
const { default: mongoose } = require("mongoose");

//Zoom meeting Create
router.post("/meeting/add", checktoken, async(req,res)=>{
    try{
        const meeting = new Zoom({
            meeting_id:req.body.meeting_id,
            passcode:req.body.passcode,
            class_id:req.body.class_id,
            time:req.body.time,
            batch_id:req.body.batch_id
        })
        await meeting.save()
        return res.status(200).json({success:true, data:meeting})
    }catch(err){
        return res.status(401).json({success:false, msg:err.message})
    }
})


//Zoom meeting listing
router.get("/meeting/list", checktoken, async(req,res)=>{
    try{
        let matchobj = {}
        if (req.query.class_id) {
            matchobj['class_id'] = mongoose.Types.ObjectId(req.query.class_id)
        }
        // let arg = {
        const result = await Zoom.aggregate([
            {
                $match: { ...matchobj }
            },
            {
                $lookup: {
                    from: 'clas',
                    localField: 'class_id',
                    foreignField: '_id',
                    as: 'class'
                }
            },
            { $unwind: "$class" },
            {
                $lookup: {
                    from: 'batches',
                    localField: 'batch_id',
                    foreignField: '_id',
                    as: 'batch'
                }
            },
            { $unwind: "$batch" },
            {
                $project: {
                    _id:1,
                    meeting_id:1,
                    passcode:1,
                    class_id:1,
                    time:1,
                    batch_id:1,
                    class_name: "$class.class_name",
                    batch_time: "$batch.batch_time",
                    status: 1,
                }
            }

        ])
   
        return res.status(200).json({success:true, data:result})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
})


//Zoom meeting Update
router.patch("/meeting/update/:_id", checktoken, async(req,res)=>{
    const _id = req.params._id
    try{
        const zoommeet = await Zoom.findByIdAndUpdate(_id, req.body)
        return res.status(200).json({success:true, data:zoommeet})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
})


//Zoom meeting delete
router.delete("/meeting/delete/:_id", checktoken, async(req,res)=>{
    const _id = req.params._id
    try{
        const ZoomMeeting = await Zoom.findByIdAndDelete(_id)
        return res.status(200).json({success:true, data:ZoomMeeting})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
})


//Session Get Api
router.get("/session/list", checktoken, async(req, res)=>{
    try{
        const sess = await Session.find()
        return res.status(200).json({success:true, data:sess})
    }catch(err){
        return res.status(401).json({success:false, err:err.message})
    }
})

module.exports = router