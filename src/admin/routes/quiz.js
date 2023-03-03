const express = require('express');
const question = require('../models/question');
const questionSet = require("../models/questionSetPaper")
const studentClass = require("../models/class")
const mongoose = require('mongoose');
const checkToken = require('../middleware/check-token');
const router = express.Router();


// **** Get All question List **** //
router.post('/quiz/list', checkToken, async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body._id)
    try {
        const ques = await questionSet.aggregate([{ $match: { _id: id } },
        {
            $lookup:
            {
                from: "quizzes",
                localField: "_id",
                foreignField: "set",
                as: "result"
            }
        }, { $project: { "chapter_name": 0, "qps_title": 0, "qps_time": 0, "qps_mark": 0, "no_of_ques": 0, "qps_language": 0, "ques_ids": 0, "qps_date": 0, "solution_pdf": 0, "__v": 0, "qps_status": 0 } }
        ])
        const setDetails = await questionSet.findById({ _id: id }).select(['-_id', '-status'])
        const clas = await studentClass.findOne({ _id: setDetails.class_id }).select(['-_id', '-status'])
        return res.status(200).json({ success: true, result: ques[0], class: clas })
            // console.log(ques)
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }
})

// ** Add question** //
router.post('/quiz/add', checkToken, async (req, res) => {
    try {
        const data = new question({
            //_id: new mongoose.Types.ObjectId,
            set: req.body.set,
            question: req.body.question,
            options: req.body.options,
            add_date: new Date()
        })
        data
            .save()
            .then(result => {
                res.status(200).json({
                    success: true,
                    message: 'data stored!',
                    data: data
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


//Question Edit
router.patch('/quiz/update/:_id', checkToken, (req, res, next) => {

    question.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete Question 
router.delete('/quiz/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    question.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});



module.exports = router;