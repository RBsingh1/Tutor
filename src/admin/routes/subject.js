const express = require('express');
const Subject = require('../models/subject');
const Student = require('../models/student')
const Notification = require('../models/notify')
const NotificationLog = require('../models/notify-log')
const Class = require('../models/class');
const Department = require('../models/department');
const Chapter = require('../models/chapter');
const mongoose = require('mongoose');
const checkToken = require('../middleware/check-token');
const { validationResult } = require('express-validator');
//const chapter = require('../models/chapter');
const router = express.Router();


// **** Get All Chapters List **** //
router.get('/chapter/list', checkToken, async (req, res) => {
    try {
        let matchobj = {}
        if (req.query.subject_id) {
            matchobj['subject_id'] = mongoose.Types.ObjectId(req.query.subject_id)
        }
        // let arg = {
        const details = await Chapter.aggregate([
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
                    from: 'clas',
                    localField: 'class_id',
                    foreignField: '_id',
                    as: 'class'
                }
            },
            { $unwind: "$class" },
            {
                $project: {
                    _id: 1,
                    class_id: 1,
                    subject_id: 1,
                    board: 1,
                    language: 1,
                    chapter_title: 1,
                    date: 1,
                    subject_name: "$subject.name",
                    class_name: "$class.class_name",
                    status: 1,
                }
            }

        ])
        return res.status(200).json({
            success: true,
            count: details.length,
            msg: 'Chapter List',
            data: details
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


// ** Add subject** //
router.post('/chapter/add', checkToken, async (req, res) => {
    const class_id = req.body.class_id

    try {
        const studentList =await Student.find({class_id, status:'active'}).select('class_id');

        const data = new Chapter({
            class_id: req.body.class_id,
            subject_id: req.body.subject_id,
            board: req.body.board,
            language: req.body.language,
            chapter_title: req.body.chapter_title,
            description: req.body.description,
            status: req.body.status,
        })
        data.save().then(result => {
            for (const [_, value] of Object.entries(studentList)) {
                const addNotifi = new Notification({
                    notification_title:result.chapter_title ,
                    notification_description: "New Chapter Added " + result.chapter_title,
                    class_id: result.class_id,
                    sent_on: "Notification Only",
                    status: result.status,
                    addedat: new Date()
                })
                addNotifi.save().then(result => {
                    for (const [_, value] of Object.entries(studentList)) {
                        const dataLog = new NotificationLog({
                            notify_id : result._id,
                            student_id   : value._id
                        });
                        dataLog.save();
                if (addNotifi)
                    var noti = Student.findOneAndUpdate({ class_id: value.class_id, status: "active" }, { $inc: { notification_count: 1 } },
                        function (err, res) {
                            console.log(err)
                        });
            }        
        })
      }  
    })
    res.status(200).json({ success: true, message: "Data Stored", message: "New Chapter Added" })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


//Chapter Edit
router.patch('/chapter/update/:_id', checkToken, (req, res) => {

    Chapter.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete chapter 
router.delete('/chapter/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Chapter.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});






// **** Get All Subject List **** //
router.get('/subject/list', checkToken, async (req, res) => {
    try {
        let matchobj = {}
        if (req.query.class_id) {
            matchobj['class_id'] = mongoose.Types.ObjectId(req.query.class_id)
        }
        const result = await Subject.aggregate([
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
                $project: {
                    class_id: 1,
                    _id: 1,
                    name: 1,
                    image: 1,
                    class_name: "$class.class_name",
                    status: 1,
                    date: 1,
                }
            }


        ])

        return res.status(200).json({
            success: true,
            count: result.length,
            msg: 'Subject List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


// ** Add subject** //
router.post('/subject/add', checkToken, async (req, res) => {
    try {
        const data = new Subject({
            class_id: req.body.class_id,
            name: req.body.name,
            image: req.body.image,
            status: req.body.status,
            date: new Date()
        })
        data
            .save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    success: true,
                    message: 'data stored!'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: false, error: err
                });
            })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});

//Suject Edit
router.patch('/subject/update/:_id', checkToken, (req, res, next) => {

    Subject.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete a row 
router.delete('/subject/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Subject.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ success: false, error: err });
        });
});

module.exports = router;