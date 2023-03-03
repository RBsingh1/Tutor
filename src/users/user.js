require('dotenv').config(); //get env variables

const express = require('express');
const _ = require('lodash')
const otpGenerator = require('otp-generator')
const User = require('../models/user');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require("../admin/models/student")
const OtpVerify = require('../admin/models/otpsave')
const Subject = require('../admin/models/subject')
const checktoken = require('../users/usermiddleware/verify_token')
const Class = require('../admin/models/class')
const upload = require('../models/uploadimage')
const Notification = require("../admin/models/notify")
const checkBox = require("../admin/models/SubjectCheckbox")
const Chapter = require('../admin/models/chapter');
const questionSet = require('../admin/models/questionSetPaper');
const question = require('../admin/models/question');
const Banner = require("../admin/models/banner")
const Notice = require("../admin/models/noticeBoard")
const Payment = require("../admin/models/payment")
const Topic = require("../admin/models/topic")
const Admin = require("../admin/models/admin")
const NotificationLog = require('../admin/models/notify-log')
const Sample = require("../admin/models/samplePaper")
const Zoom = require("../admin/models/Zoom_meeting")


const quiz = require("../models/quizresult")
const resultlog = require("../models/resultlog");
const quizresult = require('../models/quizresult');


















router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'User does not exits!'
                });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(
            user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Mail Exists!"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId,
                                email: req.body.email,
                                password: hash
                            })
                            user
                                .save()
                                .then(result => {
                                    console.log(result);
                                    res.status(200).json({
                                        message: 'User created'
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                })
                        }

                    });
                }
            }
        )

});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user deleted!"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


router.get('/getData', (req, res) => {
    res.status(200).json({
        message: 'Express API is working @ port:3000'
    });
});

router.get('/userList', (req, res, next) => {
    User.find()
        .select('email password _id')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                users: result.map(result => {
                    return {
                        email: result.email,
                        password: result.passwor,
                        _id: result._id
                    }
                }
                )
            }
            // console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});


//testing Api
router.post('/signin', async (req, res) => {
    const mobile_number = req.body.mobile_number
    try {
        const data = await Student.findOne({ mobile_number: mobile_number })
        if (!data) { return res.status(500).json({ success: false, message: 'Please Enter a Valid Contact No' }) }
        res.status(200).json({ success: true, data })
        //console.log(data)

    } catch (error) {
        return res.status(500).json({ success: false, error: "Please Enter a Valid Mobile_no" })
    }

})


//OTP GENERATE
router.post('/login_by_otp', async (req, res) => {
    const mobile_number = req.body.mobile_number
    try {
        const Data = await Student.findOne({ mobile_number })
        if (!Data) { res.status(400).json({ success: false, message: 'Please Enter a Valid Contact No' }) }

        const AutoOTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })
        const otp = new OtpVerify({ mobile_number: mobile_number, otp: AutoOTP })
        const salt = await bcrypt.genSalt(10)
        otp.otp = await bcrypt.hash(otp.otp, salt)

        const result = otp.save(function (err) {
        })
        res.status(200).json({ success: true, message: "OTP SEND SUCCESSFULLY " + AutoOTP })
        console.log(AutoOTP)



    } catch (error) {
        // res.status(500).json({success:false, error})
    }

})



//VERIFY OTP
router.post('/verify_otp', async (req, res) => {
    const mobile_number = req.body.mobile_number
    const otpHolder = await OtpVerify.find({
        mobile_number: req.body.mobile_number
        // otp : req.body.otp

    })
    //console.log(otpHolder)
    if (otpHolder != null && otpHolder.length === 0) return res.status(400).json({ success: false, message: 'EXPIRED OTP' })
    const rightthreeFind = otpHolder[otpHolder.length - 1]
    //console.log(rightthreeFind)
    const validUser = bcrypt.compareSync(req.body.otp, rightthreeFind.otp)
    if (rightthreeFind.mobile_number === req.body.mobile_number && validUser) {
        const Data1 = new Student(_.pick(req.body, ["mobile_number"]))
        const user = await Student.findOne({ mobile_number })
        console.log(user)

        const payload = {
            user: {
                _id: user._id,
                mobile_number: user.mobile_number,
                class_id: user.class_id,
                select_batch_time: user.select_batch_time

            },
        };

        //    console.log(payload);
        jwt.sign({ payload }, process.env.JWT_KEY, { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    success: true,
                    message: "Login successfully",
                    token: token,
                });
            }
        );

    } else {
        return res.status(401).send({
            success: false,
            message: "Your otp was wrong",
        })
    }
})


//verify user by password
router.post('/login/password', async (req, res) => {
    const { email, password } = req.body
    try {
        const User = await Student.findOne({ email })
        if (!User) {
            return res.status(501).json({ success: false, msg: "Invalid Email" })
        }
        const passwordMatch = await Student.findOne({ password })
        if (!passwordMatch) {
            return res.status(501).json({ success: false, msg: "Invalid Password" })
        }
        const payload = {
            user: {
                _id: User._id,
                contact_no: User.contact_no,
                class_id: User.class_id,
                // select_batch_time: User.select_batch_time
            }
        }
        jwt.sign({ payload }, process.env.JWT_KEY, { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    success: true,
                    message: "Login successfully",
                    token: token,
                });
            }
        );
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})





//CLASS AND SUBJECT API IN ONE ROUTE
router.get('/subject_class', checktoken, async (req, res) => {
    try {

        const subzect = await Subject.find()
        const sub = await Class.find()
        const result = { "subject": subzect, "class": sub }
        res.status(200).json({ success: true, result })


    } catch (error) {
        res.status(500).json({ succes: false, message: error.message })
    }
})


//Update personal details
router.post('/student_update', checktoken, upload, async (req, res) => {

    const id = req.body._id;

    const Details = {
        name: req.body.name,
        email: req.body.email,
        father_name: req.body.father_name,
        roll_no: req.body.roll_no,
        date_of_admission: req.body.date_of_admission,
        student_photo: req.body.student_photo
    }
    if (req.file) {
        student_photo = req.file.path
    }

    try {

        const { name, email } = req.body
        if (!name || !email) {
            return res.status(400).json({ error: 'Please Filled The Data' })
        }
        const Data = await Student.updateOne({ _id: id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                father_name: req.body.father_name,
                roll_no: req.body.roll_no,
                date_of_admission: req.body.date_of_admission,
                student_photo: "http://18.191.154.95:3000/" + req.file.path.replace(/\\/g, '/'),
            },
        })
        console.log(Details)
        return res.status(200).json({ success: true, Data })
    } catch (error) {
        return res.status(500).json({ success: false, error })

    }

})


//Update personal details without Image
router.post('/student_update_data', checktoken, async (req, res) => {

    const id = req.body._id;

    const Details = {
        name: req.body.name,
        email: req.body.email,
        father_name: req.body.father_name,
        roll_no: req.body.roll_no,
        date_of_admission: req.body.date_of_admission,
    }
    try {

        const { name, email } = req.body
        if (!name || !email) {
            return res.status(400).json({ error: 'Please Filled The Data' })
        }
        const Data = await Student.updateOne({ _id: id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                father_name: req.body.father_name,
                roll_no: req.body.roll_no,
                date_of_admission: req.body.date_of_admission,
            },
        })
        console.log(Details)
        return res.status(200).json({ success: true, Data })
    } catch (error) {
        return res.status(500).json({ success: false, error })

    }

})


//get student personal details
router.get("/student/details/:_id", checktoken, async (req, res) => {
    const _id = req.params._id
    try {
        const detail = await Student.findById({ _id })
        return res.status(200).json({ success: true, data: detail })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})


//Profile picture Api
router.get("/profile", checktoken, async (req, res) => {
    const _id = req.user._id
    try {
        const data = await Student.findById({ _id }).select(['student_photo', 'name', 'mobile_number'])
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})



//Student Data Get By ObjectId
router.post('/student_objectid', checktoken, async (req, res) => {
    const _id = req.body._id
    //const contact_no = req.body.contact_no
    try {
        const stu = await Student.findById({ _id })
        var url = (stu.student_photo).split('/');
        // console.log(url)
        var blankurl = '';
        if (url[0] == 'http:') {
            blankurl = stu.student_photo;
        } else {
            blankurl = "http://18.191.154.95:3000/uploads/" + stu.student_photo;

        }
        var details = {
            board: stu.board,
            admin_id: stu.admin_id,
            class_id: stu.class_id,
            select_batch_time: stu.select_batch_time,
            name: stu.name,
            father_name: stu.father_name,
            mother_name: stu.mother_name,
            email: stu.email,
            sex: stu.sex,
            mobile_number: stu.mobile_number,
            contact_guardian_no: stu.contact_guardian_no,
            date_of_birth: stu.date_of_birth,
            address: stu.address,
            payment_type: stu.payment_type,
            fee_amount: stu.fee_amount,
            payment_mode: stu.payment_mode,
            roll_no: stu.roll_no,
            notification_count: stu.notification_count,
            session: stu.session,
            exam_seating: stu.exam_seating,
            login_code: stu.login_code,
            status: stu.status,
            added_at: stu.added_at,
            modified_at: stu.modified_at,
            student_photo: blankurl
        }

        res.status(200).json({ success: true, stu: details })
    } catch (err) {
        res.status(401).json({ success: false, message: 'Please enter a valid ID' })
    }
})


// Old api for student_subject but important for future
//Subject api
// router.get('/student_subject', checktoken, async (req, res) => {
//     const class_id = req.user.class_id;
//     try {

//         const subjArr = await Subject.find({ class_id: class_id, status: 'active' });
//         const finalArr = [];
//         var isQS = '';
//         for (const [_, value] of Object.entries(subjArr)) {
//             isQS = await questionSet.find({ subject_id: value._id, class_id, qps_status: 'active' });
//             // console.log(_)
//             var subj = '';
//             if (isQS != '' || isQS != null || isQS != undefined) {
//                 if (isQS.length > 0) {
//                     subj = {
//                         _id: value._id,
//                         class_id: value.class_id,
//                         status: value.status,
//                         date: value.date,
//                         name: value.name,
//                         image: value.image,
//                         number_of_set: isQS.length
//                     }
//                     finalArr.push(subj);
//                     // console.log(finalArr)
//                 }
//             }

//         }
//         if (subjArr != '' && subjArr.length > 0) {

//             res.status(200).json({ success: true, finalArr })
//         } else {
//             res.status(200).json({ success: false, message: 'subject not exist' });

//         }


//     } catch (error) {
//         res.status(500).json({ succes: false, message: error.message })
//     }
// })


//Subject api
router.get('/student_subject', checktoken, async (req, res) => {
    const class_id = mongoose.Types.ObjectId(req.user.class_id);

    try {
        
        let matchobj = {}
        if (req.query.subject_id) {
            matchobj['subject_id'] = mongoose.Types.ObjectId(req.query.subject_id)
        }
        const result = await questionSet.aggregate([
            
            {
                $match: { ...matchobj, class_id, qps_status: 'active' }
            },
            {
                    $group: { _id:{subject_id:"$subject_id"} }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: '_id.subject_id',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            { $unwind: "$subject" },
           
            {
                $project: {
                    // _id: "$subject._id",
                    class_id: "$subject.class_id",
                    status: "$subject.status",
                    date: "$subject.date",
                    image: "$subject.image",
                    subject_name: "$subject.name",
                    subject_id:"$subject._id" ,
                }
            }


        ]).sort({_id:"-1"})
        res.status(200).json({ success: true, count: result.length, data: result })

    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})



// Notifications api
router.get("/notification", checktoken, async (req, res) => {
    try {
        const Notify = await Notification.find()
        res.status(200).json({ success: true, count: Notify.length, Notify })
    } catch (err) {
        res.status(401).json({ success: false, message: err.message })
    }
})


//notification list api
router.get("/notification/listing", checktoken, async (req, res) => {
    const student_id = mongoose.Types.ObjectId(req.body._id)
    try {
        let matchobj = {}
        if (req.query.notify_id) {
            matchobj['notify_id'] = mongoose.Types.ObjectId(req.query.notify_id)
        }
        const result = await NotificationLog.aggregate([
            {
                $match: { ...matchobj, student_id }
            },
            {
                $lookup: {
                    from: 'notifis',
                    localField: 'notify_id',
                    foreignField: '_id',
                    as: 'notifiLogs'
                }
            },
            { $unwind: "$notifiLogs" },

            {
                $project: {

                    title: "$notifiLogs.notification_title",
                    description: "$notifiLogs.notification_description",
                    date: "$notifiLogs.updatedAt"
                }
            }

        ])

        res.status(200).json({ success: true, count: result.length, data: result })
    } catch (err) {
        res.status(401).json({ success: false, message: err.message })
    }
})


// notification update api
router.post("/notification/seen", checktoken, async (req, res) => {
    // const _id = req.body._id; /** log table unique id */
    const student_id = req.body.student_id;
    const check = await NotificationLog.find({ student_id });
    // if(check === '' || check === null){
    //     return res.status(401).json({ success: false, message: 'Wrong Id!' })
    // }

    const result = await NotificationLog.findOneAndUpdate({ student_id }, { is_seen: true });
    if (result) {
        //update query of user table (++ -- )
        const getnoti = await Student.findById({ _id: student_id });
        if (getnoti.notification_count > 0) {
            // const newCount = getnoti.notification_count - 1;
            const getnoti = await Student.updateOne({ _id: student_id }, { notification_count: 0 });
        }

        return res.status(200).json({ success: true, data: result })
    }
    return res.status(401).json({ success: false, msg: 'error' })
})


//subject checkbox api
router.post("/subject_checkbox", checktoken, async (req, res) => {
    try {
        const check = new checkBox(req.body)
        const result = await check.save()
        res.status(200).json({ success: true, result })
    } catch (err) {
        res.status(401).json({ success: false, message: err.message })
    }
})


//contact us api
router.get("/contact_us", checktoken, async (req, res) => {
    //const _id = req.params._id;
    try {
        const adminData = await Admin.findOne({ status: 'active' })
        var result = {
            mobile_number: adminData.mobile_number,
            email: adminData.email,
            first_name: adminData.first_name,
            last_name: adminData.last_name,
        };
        return res.status(200).json({ success: true, result })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
})


//chapter get api
router.post("/chapter", checktoken, async (req, res) => {
    const admin_id = req.body.admin_id
    try {
        const Data = await Chapter.find({ admin_id })
        return res.status(200).json({ success: true, Data })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
})


//Connect Two Collections
router.post("/quiz", checktoken, async (req, res) => {
    const class_id = req.body.class_id
    try {
        const quiz = await questionSet.aggregate([{ $match: { admin_id } },
        {
            $lookup:
            {
                from: "classes",
                localField: "admin_id",
                foreignField: "admin_id",
                as: "result"
            }
        },
        ])
        return res.status(200).json({ success: true, quiz })
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }
})


//All Quiz Questions Get
router.get("/quiz/question", checktoken, async (req, res) => {
    try {
        const List = await question.find()
        return res.status(200).json({ success: true, List })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
})


//Question Get by Admin id and Subject
router.post("/quiz/question/list", checktoken, async (req, res) => {
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
        }, { $project: { "chapter_name": 0, "qps_title": 0, "qps_time": 0, "qps_mark": 0, "no_of_ques": 0, "qps_language": 0, "ques_ids": 0, "qps_date": 0, "solution_pdf": 0, "__v": 0, "qp_status": 0 } }
        ])
        return res.status(200).json({ success: true, result: ques[0] }),
            console.log(ques)
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }
})




//QuetionSet call by adminid and subject
router.post('/subject/question', async (req, res) => {
    const admin_id = req.body.admin_id
    const subject = req.body.subject
    try {
        const Data = await questionSet.find({ admin_id, subject })
        return res.status(200).json({ success: true, Data })
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message })
    }
})


//class call by admin_id
router.post('/student/class', checktoken, async (req, res) => {
    const admin_id = req.body.admin_id
    try {

        const clas = await Class.find({ admin_id })
        res.status(200).json({ success: true, clas })


    } catch (error) {
        res.status(500).json({ succes: false, message: error.message })
    }
})


//student subject list or one subject
router.post('/student/subject', checktoken, async (req, res) => {
    const class_id = req.body.class_id
    try {
        let subjec = "no data found";
        let status = false;
        let msg = "empty";
        if (!class_id) {
            subjec = await Subject.find()
            status = true;
            msg = "All class subject";
        } else {
            subjec = await Subject.find({ class_id, status: 'active' })
            status = true;
            msg = "one class subject";
        }
        return res.status(200).json({ success: status, msg: msg, subjec })

    } catch (error) {
        res.status(500).json({ succes: false, message: error.message })
    }
})


//Banner Api
router.get("/banner", async (req, res) => {
    try {
        const banner = await Banner.find({ banner_status: "active" })
        return res.status(200).json({ success: true, data: banner })
    } catch (err) {
        return res.status(400).json({ success: false, msg: err.message })
    }
})


//News Api
router.get("/news", async (req, res) => {
    try {
        const news = await Notice.find({ status: "active" })
        return res.status(200).json({ success: true, data: news })
    } catch (err) {
        return res.status(400).json({ success: false, msg: err.message })
    }
})


//Payment History Api
router.get("/payment/history/:_id", async (req, res) => {
    const student_id = req.params
    try {
        const payment = await Payment.find({ student_id })
        return res.status(200).json({ success: true, data: payment })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})


//quiz result Api
router.post("/quizresult", async (req, res) => {
    const ques_no = req.body.ques_no
    try {
        const result = await resultlog.find({ ques_no })
        return res.status(200).json({ success: true, data: result })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})


//Create quiz result
router.post("/quizresult/add", async (req, res) => {

    try {
        const check = new quizresult({
            student_id: req.body.student_id,
            qset: req.body.qset,
            class_id: req.body.class_id,
            subject_id: req.body.subject_id,
            duration: req.body.duration,
            total_question: req.body.total_question,
            wrong: req.body.wrong,
            correct: req.body.correct,
            skip: req.body.skip,
            percentage: req.body.percentage,
            grade: req.body.grade,
            status: req.body.status
        })
        check.save()
        return res.status(200).json({ success: true, msg: check })
    } catch (err) {
        res.status(401).json({ success: false, msg: err.message })
    }
})


// function gradeSystem(scoreP) {
//     var grade = '';
//     if (scoreP < 35) {
//         grade = 'Fail';
//     } else if (scoreP >= 35 && scoreP < 50) {
//         grade = 'Good';
//     } else if (scoreP >= 50 && scoreP < 70) {
//         grade = 'Better';
//     } else if (scoreP >= 70 && scoreP < 90) {
//         grade = 'Best';
//     } else if (scoreP >= 90 && scoreP < 100) {
//         grade = 'Excellent';
//     } else {
//         grade = '';
//     }
//     return grade;
// }


//quiz score Api
router.get("/quiz/score/:student_id", checktoken, async (req, res) => {
    const student_id = mongoose.Types.ObjectId(req.params.student_id)
    try {
        let matchobj = {}
        if (req.query.subject_id) {
            matchobj['subject_id'] = mongoose.Types.ObjectId(req.query.subject_id)
        }
        const result = await quiz.aggregate([
            {
                $match: { ...matchobj, student_id }
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
                $project: {
                    student_id: 1,
                    qset: 1,
                    class_id: 1,
                    subject_id: 1,
                    subject_name: "$subject.name",
                    duration: 1,
                    createdAt: 1,
                    correct: 1,
                    wrong: 1,
                    total_question: 1,
                    grade: 1
                }
            }

        ])

        return res.status(200).json({ success: true, count: result.length, data: result })
    } catch (err) {
        return res.status(400).json({ success: false, msg: err.message })
    }
})


//topic api
router.post("/topic", checktoken, async (req, res) => {
    const class_id = req.body.class
    try {
        const data = await Topic.find({ class: class_id })
        //const jp = JSON.parse(JSON.stringify(data))
        //console.log(jp)
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
})


//questionSet List Api
router.post("/questionset/list", checktoken, async (req, res) => {
    const { class_id, subject_id } = req.body
    try {
        const questionet = await questionSet.find({ class_id, subject_id, qps_status: "active" })
            .select(['qps_title', 'qps_language', 'qps_time', 'qps_mark', 'no_of_ques'])
        return res.status(200).json({ success: true, data: questionet })
    } catch (err) {
        return res.send(401).json({ success: false, msg: err.message })
    }
})


//GetScore API for one set
router.post("/quiz/getscore", async (req, res) => {
    const { student_id, qset } = req.body
    try {
        const score = await quizresult.find({ student_id, qset })
        var quiz_completion = []
        for (const [_, value] of Object.entries(score)) {
            const pers = (parseInt(value.total_question) * 100) / parseInt(value.total_question);
            //console.log(pers)
            var completion = pers;
            const marks = (parseInt(value.correct) * 5);
            var total_obtain_marks = marks;
            const Score = {
                student_id: value.student_id,
                qset: value.qset,
                class_id: value.class_id,
                subject: value.subject,
                correct: value.correct,
                wrong: value.wrong,
                total_question: value.total_question,
                total_obtain_marks: total_obtain_marks,
                completion: completion + "%"
            }
            quiz_completion.push(Score)
        }
        return res.status(200).json({ success: true, data: quiz_completion })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})



/** get subject by class start */
router.get('/student/subjects/:class_id', checktoken, async (req, res) => {
    const class_id = req.params.class_id
    try {
        let subjec = await Subject.find({ class_id });
        const count = (subjec.length > 0) ? subjec.length : 0;
        return res.status(200).json({ success: true, msg: "Student Subject List", numSubject: count, data: subjec })

    } catch (error) {
        res.status(500).json({ succes: false, message: error.message })
    }
});
/** get subject by class end */




/**chapter topic get by subject_id start */
router.post('/chapter/topic', checktoken, async (req, res) => {
    const subject_id = mongoose.Types.ObjectId( req.body.subject_id )
    // const subject_id = req.body.subject_id
    try {
        let matchobj = {}
        if (req.query.chapter_id) {
            matchobj['chapter_id'] = mongoose.Types.ObjectId(req.query.chapter_id)
        }
        const result = await Topic.aggregate([

            {
                $match: { ...matchobj, subject_id, status: 'active' }
            },
            {
                $group: { _id: { chapter_id: "$chapter_id" } }
            },
            {
                $lookup: {
                    from: 'chapters',
                    localField: '_id.chapter_id',
                    foreignField: '_id',
                    as: 'chapter'
                }
            },
            { $unwind: "$chapter" },
            {
                $lookup: {
                    from: 'topics',
                    localField: '_id.chapter_id',
                    foreignField: 'chapter_id',
                    as: 'topic'
                }
            },
            // { $unwind: "$topic" },
            // {
            //     $project: {
            //         chapter_title: "$chapter.chapter_title",
            //         status: "$chapter.status",
            //         topic_id: "$topic._id",
            //         topic_name: "$topic.topic_name",
            //         upload_pdf: "$topic.upload_pdf",
            //         chapter_id:"$topic.chapter_id",
            //         status: "$topic.status",
            //     }
            //}

        ]).sort({_id:-1})
        // var resultArr = [];
        // const Allchapter = await Chapter.find({ subject_id });
        // // console.log(Allchapter)
        // for (const [_, value] of Object.entries(Allchapter)) {
        //     const topicdata = await Topic.find({ chapter_id: value._id, subject_id: subject_id, status: "active" });

        //     var resulttopicArr = [];
        //     if (topicdata) {
        //         for (const [_, tvalue] of Object.entries(topicdata)) {
        //             var topic = {
        //                 topic_id: tvalue._id,
        //                 topic_name: tvalue.topic_name,
        //                 // upload_pdf: "http://18.191.154.95:3000/Images/topicdocument/" + tvalue.upload_pdf,
        //                 upload_pdf: tvalue.upload_pdf,
        //                 status: tvalue.status,
        //             };
        //             resulttopicArr.push(topic);
        //         }
        //     }
        //     //if(topicdata != '' && topicdata != null){
        //     var chapter = {
        //         chapter_id: value._id,
        //         chapter_title: value.chapter_title,
        //         status: value.status,
        //         topic: resulttopicArr
        //     }//};
        //     resultArr.push(chapter);
        // }

        return res.status(200).json({
            success: true,
            status: 200,
            count: result.length,
            msg: 'chapter List',
            data: result
        })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})
/**chapter topic get by subject_id end*/


//Zoom meeting listing
router.get("/meeting/list", checktoken, async (req, res) => {
    try {
        const zoom = await Zoom.find()
        return res.status(200).json({ success: true, data: zoom })
    } catch (err) {
        return res.status(401).json({ success: false, err: err.message })
    }
})


// Sample Paper Get by class_id from token
router.get("/samplepaper", checktoken, async (req, res) => {
    const class_id = mongoose.Types.ObjectId(req.user.class_id)
    // console.log(class_id)
    try {
        let matchobj = {}
        if (req.query.class_id) {
            matchobj['class_id'] = mongoose.Types.ObjectId(req.query.class_id)
        }
        const result = await Sample.aggregate([
            {
                $match: { ...matchobj, class_id, status: 'active' }
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
                    class_name: "$class.class_name",
                    title: 1,
                    exam_seating: 1,
                    starting_time: 1,
                    time_duration: 1,
                    upload_document: 1,
                    type: 1,
                    status: 1
                }
            }

        ])

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
})




module.exports = router


