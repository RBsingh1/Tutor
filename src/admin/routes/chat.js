const express = require("express")
const router = express.Router()
const Chat = require("../models/chat")
const Student = require("../models/student")
const ChatReply = require("../models/chatreply")
const checkToken = require('../middleware/check-token');
const upload = require('../models/chatImageFiles')
const mongoose = require('mongoose')
 



/** Delete one chat */
router.delete('/chat/delete/:_id', checkToken, (req, res, next) => {
    const id = req.params._id;
    Chat.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});

/** chat with student */
router.post("/chat/admin", checkToken, async (req, res) => {
    
    if (Object.keys(req.body).length === 0) {
        return res.status(402).json({ success: false, msg: "Message should not be blank" })
      }
    try {
        
        const admin = await new Chat({
            student_id  : req.body.student_id,
            reply_to    : req.body.reply_to,
            message     : req.body.message,
            isAdmin     : true
        })
        admin.save();
        return res.status(200).json({ success: true, data: admin })

    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})

/** GetAll chat of All Students */
router.get('/chat/getalllist', checkToken, async (req, res) => {
    const id = mongoose.Types.ObjectId

    try {
        
        /** const chatList = await Chat.find({  })
         .populate({ path:'student_id',select:['name','student_photo'] });
         
         db.table_1.aggregate([
            {$group : {_id : {email: "$email", type:"$type"},total: { $sum: "$amount" }}},
            {$lookup: {from: "table_2", localField: "_id.email", foreignField: "email", as: "details"}},
            {$match: {details: {$ne: []}}}
        ]);

*/
        const chatList = await Chat.aggregate([
            {
                $group:{_id:{student_id:'$student_id'}}
            },
            { $match:{student_id:id} },
            
            {
                $lookup:
                {
                    from: "students",
                    localField: "_id.student_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            }, 
            //{"$unwind":"$studentInfo"},
            { 
                $project: 
                { 
                    "studentInfo.father_name": 0, "studentInfo.board":0, "studentInfo.select_batch_time":0, "studentInfo.mother_name":0, "studentInfo.email":0, "studentInfo.password":0, "studentInfo.sex":0, "studentInfo.contact_number_father": 0, "studentInfo.date_of_birth": 0, "studentInfo.address": 0, "studentInfo.payment_type": 0, "studentInfo.fee_amount": 0, "studentInfo.payment_mode": 0, "studentInfo.roll_no": 0, "studentInfo.session": 0, "studentInfo.exam_seating": 0, "studentInfo.login_code": 0, "studentInfo.status": 0, "studentInfo.added_at": 0, "studentInfo.modified_at": 0, "studentInfo.reg": 0, "studentInfo.__v": 0, "studentInfo.admin_id":0, "studentInfo.date_of_admission":0
                } 
            }
        ]);

        return res.status(200).json({
            success: true,
            status: 200,
            msg: 'Get All Chat',
            data: chatList
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});

/** All chat with single student  */
router.get('/chat/list/:student_id',  async (req, res) => {
    const student_id = req.params.student_id
    try {
        const result = await Chat.find({student_id});
        return res.status(200).json({
            success: true,
            status: 200,
            msg: 'Chat List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});

module.exports = router;