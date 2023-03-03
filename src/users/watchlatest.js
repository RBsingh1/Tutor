const express = require('express');
const { default: mongoose } = require('mongoose');
const Subject = require("../admin/models/subject")
const Topic=require("../admin/models/topic")
const checktoken = require('../users/usermiddleware/verify_token')
const router = express.Router();


router.post("/watchlatest/list",checktoken,async(req,res)=>{
    const class_id =mongoose.Types.ObjectId(req.body.class_id)
    try{
        let matchobj = {}
        if (req.query.subject_id) {
            matchobj['subject_id'] = mongoose.Types.ObjectId(req.query.subject_id)
        }
        const result = await Subject.aggregate([
            {
                $match: { class_id, status: 'active' }
            },
            
            {
                $lookup: {
                    from: 'topics',
                    localField: '_id',
                    foreignField: 'subject_id',
                    pipeline: [
                        {
                            $match: {
                                status:"active",
                              upload_video :{$ne:""}
                            },
                        },{
                            $sort:{
                                added_at:-1,
                                
                            }
                        }
                    ],
                    as: 'topic'
                }
            },
            { $unwind: "$topic" },
            {
                $project: {
                    chapter_id: "$topic.chapter_id",
                    topic_id:"$topic._id",
                    topic_name: "$topic.topic_name",
                    upload_video: "$topic.upload_video", 
                    upload_pdf: "$topic.upload_pdf",
                    subject_id:"$topic.subject_id",
                    status:"$topic.status"
                }
            }

        ]).sort({topic_id:-1}).limit(4);

    //     const subjectList = await Subject.find({ class_id })
    //    // console.log(subjectList)
    //     var resArr = [];
    //     for (const [_, value] of Object.entries(subjectList)) {
    //         const latest = await Topic.find({subject_id:value._id,  "upload_video":{"$ne":""}, "status":"active"})
    //         .select(['chapter_id','topic_name','upload_video', 'upload_pdf'])
    //         .sort({_id:-1})
    //         .limit(4);
            
    //        // console.log(value._id)
    //         resArr.push(latest);
    //     }

        var response = {
            success: true,
            count:result.length,
            message: 'Watch latest video by class',
            class_id: class_id,
            data: result,
        }
        return res.status(200).json(response)
    }catch(err){
        return res.status(401).json({success:false, msg:err.message})
    }
})
module.exports = router