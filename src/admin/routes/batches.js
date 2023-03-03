const express = require('express');
const Batch = require('../models/batches');
const Class = require("../models/class")
const mongoose = require('mongoose');
const checkToken = require('../middleware/check-token');
const router = express.Router();


// **** Get All Batches List **** //
router.get('/batch/list', checkToken, async (req, res) => {
    try {
        let matchobj = {}
        if (req.query.class_id) {
            matchobj['class_id'] = mongoose.Types.ObjectId(req.query.class_id)
        }
        const result = await Batch.aggregate([
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
                    _id:1,
                    board:1,
                    class_id:1,
                    batch_start_time:1,
                    batch_end_time:1,
                    batch_time:1,
                    status:1,
                    class_name: "$class.class_name",
                    status: 1,
                }
            }

        ])
   
        return res.status(200).json({
            success: true,
            status: 200,
            count: result.length,
            msg: 'Batches List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


// ** Add Batches** //
router.post('/batch/add', checkToken, async (req, res) => {
    try {
        const data = new Batch({
            board: req.body.board,
            class_id: req.body.class_id,
            batch_start_time: req.body.batch_start_time,
            batch_end_time: req.body.batch_end_time,
            status: req.body.status,
            batch_time:req.body.batch_time,
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


//Batches Edit
router.patch('/batch/update/:_id', checkToken, (req, res, next) => {

    Batch.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete Batches
router.delete('/batch/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Batch.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});



module.exports = router;