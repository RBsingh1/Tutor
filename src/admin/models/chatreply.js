const mongoose = require("mongoose")
const replySchema = mongoose.Schema({
    student_id: {
        type: Number,
        required: true
    },
    reply_to:{
        type:String,
        required:false
    },
    message: {
        type: String,
        required:false
    },
    updated_at:{
        type:Date,
        default:Date.now()
    },
    reply_message: {
        type: String,
        required:false
    },
    user:{
        type:String,
        required:true
    }
    
})
module.exports = mongoose.model("ChatReply", replySchema)