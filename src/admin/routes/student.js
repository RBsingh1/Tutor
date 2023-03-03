require('dotenv').config(); //get env variables

const express = require('express');
const Class = require('../models/class');
const student = require("../models/student")
const Department = require('../models/department');
const mongoose = require('mongoose');
const auth = require('../middleware/check-token');
const router = express.Router();



//sample count function
async function studentCount() {
    const sample = await student.find()
    return sample
}



// **** All Student List **** //
router.get('/student/list', auth, async (req, res) => {
    // const page = req.params.page
    try {
        // const {page = 1, limit = 50} = req.query
        const simple = await studentCount()
        // const result = await student.find().limit(20 * 1).skip((page - 1) * 20).sort({ _id: -1 })
        // var document = '';
        // var data = '';
        // if (data[0] == 'http:') {
        //     document = result.student_photo;
        // } else {
        //     document = "http://18.191.154.95:3000/uploads/" + result.student_photo;

        // }
        let matchobj = {}
        if (req.query.class_id) {
            matchobj['class_id'] = mongoose.Types.ObjectId(req.query.class_id)
        }
        const result1 = await student.aggregate([
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
                    board: 1,
                    admin_id: 1,
                    class_id: 1,
                    select_batch_time: 1,
                    name: 1,
                    father_name: 1,
                    mother_name: 1,
                    email: 1,
                    password: 1,
                    sex: 1,
                    mobile_number: 1,
                    contact_guardian_no: 1,
                    date_of_birth: 1,
                    address: 1,
                    payment_type: 1,
                    fee_amount: 1,
                    payment_mode: 1,
                    roll_no: 1,
                    notification_count: 1,
                    session: 1,
                    exam_seating: 1,
                    login_code: 1,
                    status: 1,
                    added_at: 1,
                    modified_at: 1,
                    student_photo: 1,
                    class_name:"$class.class_name"
                }
            }

           
        ])
        return res.status(200).json({
            status: 200,
            count: result1.length,
            totalCount: simple.length,
            msg: 'student List',
            data: result1
        })

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//Add student Data
router.post('/student/add', auth, async (req, res) => {
    try {
        const data = new student({
            //_id: new mongoose.Types.ObjectId,
            board: req.body.board,
            admin_id: req.body.admin_id,
            class_id: req.body.class_id,
            select_batch_time: req.body.select_batch_time,
            name: req.body.name,
            father_name: req.body.father_name,
            mother_name: req.body.mother_name,
            email: req.body.email,
            password: req.body.password,
            sex: req.body.sex,
            mobile_number: req.body.mobile_number,
            contact_guardian_no: req.body.contact_guardian_no,
            date_of_birth: req.body.date_of_birth,
            address: req.body.address,
            payment_type: req.body.payment_type,
            fee_amount: req.body.fee_amount,
            payment_mode: req.body.payment_mode,
            roll_no: req.body.roll_no,
            notification_count: req.body.notification_count,
            session: req.body.session,
            exam_seating: req.body.exam_seating,
            login_code: req.body.login_code,
            status: req.body.status,
            added_at: req.body.added_at,
            modified_at: req.body.modified_at,
            student_photo: req.body.student_photo
        })

        data
            .save()
            .then(result => {
                res.status(200).json({
                    success: true,
                    message: 'data stored!'
                });
            })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//Update Student Data
router.patch('/student/update/:_id', auth, (req, res) => {
    student.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete Student Data
router.delete('/student/delete/:_id', auth, (req, res, next) => {
    const id = req.params._id;
    student.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ success: false, msg: err });
        });
});







// **** All Class List **** //
router.get('/class/list', auth, async (req, res) => {
    try {
        const data = await Class.find();
        return res.status(200).json({
            success: true,
            msg: 'All Class List',
            data: data
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

// ** Add Class** //
router.post('/class/add', auth, async (req, res) => {
    try {
        const data = new Class({
            class_name: req.body.class_name,
            status: req.body.status
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
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//Update Class
router.patch('/class/update/:_id', auth, (req, res) => {
    Class.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete a Class 
router.delete('/class/delete/:_id', auth, (req, res, next) => {
    const id = req.params._id;
    Class.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ success: false, msg: err });
        });
});





// **** All Department List **** //
router.get('/department/list', auth, async (req, res) => {
    try {
        const data = await Department.find();
        return res.status(200).json({
            success: true,
            msg: 'All Departments List',
            data: data
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// ** Add Department ** //
router.post('/department/add', auth, async (req, res) => {
    try {
        const data = new Department({
            _id: new mongoose.Types.ObjectId,
            id: req.body.id,
            name: req.body.name,
            subject_id: req.body.subject_id
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
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//Update Department
router.patch('/department/update/:_id', auth, (req, res) => {
    Department.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete a Department 
router.delete('/department/delete/:_id', auth, (req, res, next) => {
    const id = req.params._id;
    Department.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ success: false, msg: err });
        });
});





//get list inder db
router.get('/student/list/list', auth, async (req, res) => {
    try {
        const result = await student.find();
        return res.status(200).json({
            status: 200,
            count: result.length,
            msg: 'student List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;




