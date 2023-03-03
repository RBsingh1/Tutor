const mongoose = require("mongoose")
const autoincrement = require("mongoose-auto-increment")
const studentSchema = mongoose.Schema({
    board: {
        type: String,
        required: true
    },
    admin_id: {
        type: String,
        required: false
    },
    class_id: {
        type:mongoose.Types.ObjectId,
        required:true
    },
    select_batch_time: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    father_name: {
        type: String,
        required: true
    },
    mother_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        required: true
    },
    contact_guardian_no: {
        type: Number,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    payment_type: {
        type: String,
        required: true
    },
    fee_amount: {
        type: Number,
        required: true
    },
    payment_mode: {
        type: String,
        required: true
    },
    roll_no: {
        type: Number,
        required: true
    },
    notification_count: {
        type: Number,
        default:0
    },
    session: {
        type: String,
        required: true
    },
    exam_seating: {
        type: String,
        required: true
    },
    login_code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    added_at: {
        type: Date,
        default:Date.now()
    },
    modified_at: {
        type: Date,
        default:Date.now()
    },
    student_photo:{
        type:String,
        required:false,
        default:''
    },
    date_of_admission:{
        type:String
    },
    })
    autoincrement.initialize(mongoose.connection)
    studentSchema.plugin(autoincrement.plugin, {
    model: "student",
    field: "reg",
    startAt: 1111,
    incrementBy: 1,

})
module.exports = mongoose.model("Student", studentSchema)