const mongoose = require("mongoose")
const questionSetSchema = mongoose.Schema({
    class_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    subject_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    qps_title: {
        type: String,
        required: true
    },
    qps_time: {
        type: String,
        required: true
    },
    qps_mark: {
        type: Number,
        required: true
    },
    no_of_ques: {
        type: Number,
        required: true
    },
    qps_language: {
        type: String,
        required: true
    },

    qps_date: {
        type: Date,
        required: true
    },

    solution_pdf: {
        type: String,
        required: false
    },
    qps_status: {
        type: String,
        required: true
    },
    addedAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model("QuestionSet", questionSetSchema)