const mongoose = require("mongoose")
const NotifySchema = mongoose.Schema({
    notification_title: { type: String, required: true },
    notification_description: { type: String, required: true },
    //student_id:{type:String, required:true},
    class_id: { type: String, required: true },
    sent_on: { type: String, required: true },
    status: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }

})
module.exports = mongoose.model("notifi", NotifySchema)