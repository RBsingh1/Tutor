const express = require("express")
const router = express.Router()
const Chat = require("../admin/models/chat")
// const ChatReply = require("../models/chatreply")
const checkToken = require('../users/usermiddleware/verify_token')
// const upload = require('../models/chatImageFiles')
 
/** chat with Teacher (admin) */
router.post("/chat/student", async (req, res) => {
    
    if (Object.keys(req.body).length === 0) {
        return res.status(402).json({ success: false, msg: "Message should not be blank" })
      }
    try {
        
        const admin = await new Chat({
            student_id  : req.body.student_id,
            message     : req.body.message,
            isAdmin     : false
        })
        admin.save();
        return res.status(200).json({ success: true, data: admin })

    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})

/** All chat with admin  */
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


module.exports = router