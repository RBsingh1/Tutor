const mongoose = require("mongoose")
const SampleSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    class_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    exam_seating:{
        type:String,
        required:false
    },
    starting_time:{
        type:String,
        required:false
    },
    time_duration:{
        type:String,
        required:false
    },
    upload_document:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("SamplePaper",SampleSchema)