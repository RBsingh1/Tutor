
const mongoose = require("mongoose")
const NoticeSchema = mongoose.Schema({
    notice: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type:Date,
        default: Date.now(),
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

})
module.exports = mongoose.model("NoticeBoard", NoticeSchema)