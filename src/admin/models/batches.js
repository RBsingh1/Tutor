const mongoose = require("mongoose")
const BatchSchema = mongoose.Schema({
    board: {
        type: String,
        required: true
    },
    class_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    batch_start_time: {
        type: String,
        required: true
    },
    batch_end_time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    batch_time:{
        type:String,
        required:true
    },
    createdAt: {type: Date, default: Date.now} ,
    updatedAt: {type: Date, default: Date.now} 

})
module.exports = mongoose.model("Batche", BatchSchema)