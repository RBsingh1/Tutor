const mongoose = require("mongoose")
const chatSchema = mongoose.Schema({
    student_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    reply_to:{
        type:String,
        required:false
    },
    message:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model("chat",chatSchema)