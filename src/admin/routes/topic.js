const express = require('express');
const Topic = require('../models/topic');
const mongoose = require('mongoose');
const checkToken = require('../middleware/check-token');
const Class = require("../models/class")
const Subject = require("../models/subject")
const Chapter = require('../models/chapter');
const multipleUpload = require("../models/topicUploadVideo")
const upload = require("../models/topicUploaddocument")
const router = express.Router();


// **** Get All Topic List **** //
router.get('/topic/list', checkToken, async (req, res) => {
    try {
        let matchobj = {}
        if (req.query.subject_id) {
            matchobj['subject_id'] = mongoose.Types.ObjectId(req.query.subject_id)
        }
        const topic = await Topic.aggregate([
            {
                $match: { ...matchobj }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject_id',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            { $unwind: "$subject" },
            {
                $lookup: {
                    from: 'chapters',
                    localField: 'chapter_id',
                    foreignField: '_id',
                    as: 'chapter'
                }
            },
            { $unwind: "$chapter" },
            {
                $lookup: {
                    from: 'clas',
                    localField: 'chapter.class_id',
                    foreignField: '_id',
                    as: 'class'
                }
            },
            { $unwind: "$class" },
            {
                $project: {
                    topic_id: 1,
                    topic_name: 1,
                    subject_id:1,
                    upload_video: 1,
                    upload_pdf: 1,
                    date: 1,    
                    chapter_id: 1,               
                    subject_name: "$subject.name",
                    chapter_name: "$chapter.chapter_title",
                    class_name: "$class.class_name",
                    class_id: "$chapter.class_id",
                    status: 1,
                }
            }

        ])
  
        return res.status(200).json({
            success: true,
            status: 200,
            count: topic.length,
            msg: 'Topics List',
            data: topic
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});






// ** Add Topics** //
router.post('/topic/add', checkToken, upload, async (req, res) => {
    // console.log(req.body)

    try {
        // const videoFile = multipleUploadVideo(); 
        const data = new Topic({
            topic_name: req.body.topic_name,
            chapter_id: req.body.chapter_id,
            subject_id: req.body.subject_id,
            upload_pdf: "https://tutoradminapi2.onrender.com/" + req.file.path.replace(/\\/g, '/'),
            status: req.body.status
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



//Video Add
router.post("/topic/video/:_id", checkToken, multipleUpload, async (req, res) => {
    const _id = req.params._id
    if (req.file == '' || req.file == undefined) {
        // upload_video = null;
        upload_video = req.body.upload_video
        // return res.status(200).json({ success: true, msg: "Your Video is null" })

    } else {
        upload_video = "https://tutoradminapi2.onrender.com/" + req.file.path.replace(/\\/g, '/')
    }
    try {
        const topic = await Topic.findByIdAndUpdate(_id, { upload_video: upload_video })
        return res.status(200).json({ success: true, data: topic })
    }
    catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
})


// Delete Video field
router.delete("/topic/video/delete/:_id", checkToken, multipleUpload, async (req, res) => {
    const _id = req.params._id
    try {
        if (req.file == '' || req.file == undefined) {
            await Topic.findByIdAndDelete(_id, { upload_video: req.body.upload_video })
            return res.status(401).json({ success: false, msg: "Your Video Field delete Successfully" })
        }
    }
    catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
})




//Topic Edit
router.patch('/topic/update/:_id', checkToken, upload, async (req, res, next) => {
    const _id = req.params._id;
    console.log(_id)
    if (req.file == '' || req.file == undefined) {
        upload_pdf = req.body.upload_pdf
    } else {
        upload_pdf = "https://tutoradminapi2.onrender.com/" + req.file.path.replace(/\\/g, '/')
    }


    try {

        const data = await Topic.findByIdAndUpdate(_id, {
            $set:
            {
                topic_name: req.body.topic_name,
                chapter_id: req.body.chapter_id,
                subject_id: req.body.subject_id,
                // upload_video: upload_video,
                upload_pdf: upload_pdf,
                status: req.body.status
            }
        })
        console.log(data)
        res.send({ success: true, msg: "Update successfull" });

    } catch (error) {
        return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
    }
})

//Topic Batches
router.delete('/topic/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Topic.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});




module.exports = router;
