const express = require("express")
const Sample = require("../models/samplePaper")
const Class = require("../models/class")
const checkToken = require('../middleware/check-token');
const router = express.Router();
const upload = require('../models/sampleFiles')


// **** Get All Sample Paper List **** //
router.get('/sample/list', checkToken, async (req, res) => {
    try {
        // }
        let matchobj = {}
        if (req.query.class_id) {
            matchobj['class_id'] = mongoose.Types.ObjectId(req.query.class_id)
        }
        const result = await Sample.aggregate([
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
                    _id: 1,
                    class_id: 1,
                    title: 1,
                    exam_seating: 1,
                    starting_time: 1,
                    time_duration: 1,
                    upload_document: 1,
                    type: 1,
                    class_name: "$class.class_name",
                    status: 1
                }
            }
        ])

        // var resultArr = []
        // const result = await Sample.find();
        // for (const [_, value] of Object.entries(result)) {
        //     var data = (value.upload_document).split('/');
        //     var document = '';
        //     if(data[0] =='http:' ){
        //         document = value.upload_document;
        //     }else{
        //         document ="http://18.191.154.95:3000/Images/samplefile/" +value.upload_document;

        //     }
        //     const clas = await Class.findOne({_id:value.class_id})
        //  var details = {
        //     _id:value._id,
        //     class_id:value.class_id,
        //     class_name:clas.class_name,
        //     title:value.title,
        //     exam_seating:value.exam_seating,
        //     starting_time:value.starting_time,
        //     time_duration:value.time_duration,
        //     upload_document:document,
        //     type:value.type,
        //     status:value.status
        //  }
        //  resultArr.push(details)
        // //  console.log(resultArr)
        // }
        return res.status(200).json({
            success: true,
            status: 200,
            count: result.length,
            msg: 'Sample List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


// ** Add Sample Paper** //
router.post('/sample/add', checkToken, upload, async (req, res) => {

    try {
        const data = new Sample({
            title: req.body.title,
            class_id: req.body.class_id,
            exam_seating: req.body.exam_seating,
            starting_time: req.body.starting_time,
            time_duration: req.body.time_duration,
            upload_document: "https://tutoradminapi.onrender.com/" + req.file.path.replace(/\\/g, '/'),
            type: req.body.type,
            status: req.body.status,
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


//Sample Paper Edit
router.patch('/sample/update/:_id', checkToken, upload, async (req, res, next) => {
    const _id = req.params._id;

    if (req.file == '' || req.file == undefined) {
        upload_document = req.body.upload_document
    } else {
        upload_document = "http://18.191.154.95:3000/" + req.file.path.replace(/\\/g, '/')
    }
    try {
        await Sample.findByIdAndUpdate({ _id }, {
            $set: {
                title: req.body.title,
                class_id: req.body.class_id,
                exam_seating: req.body.exam_seating,
                starting_time: req.body.starting_time,
                time_duration: req.body.time_duration,
                upload_document: upload_document,
                type: req.body.type,
                status: req.body.status
            },
        }), res.send({ success: true, msg: "Update successfull" });

    } catch (error) {
        return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
    }
})


//Delete Sample Paper
router.delete('/sample/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Sample.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});



module.exports = router;
