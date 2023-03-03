const mongoose = require("mongoose")
const NotifyLogSchema = mongoose.Schema({
   
    notify_id: { type: mongoose.Types.ObjectId, required: true },
    student_id: { type: mongoose.Types.ObjectId, required: true },
   // status: { type: String, required: true },
    is_seen: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },

})
module.exports = mongoose.model("notifiLog", NotifyLogSchema)