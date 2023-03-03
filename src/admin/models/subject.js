const mongoose = require("mongoose")
const subjectSchema = mongoose.Schema({
    class_id:{type:mongoose.Types.ObjectId,required:true},
    name: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: String, required: false },
    date: { type: Date, default:Date.now() },
})
module.exports = mongoose.model("subject",subjectSchema)