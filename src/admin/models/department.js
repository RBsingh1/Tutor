const mongoose = require('mongoose');
const departmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number, required: false },
    name : { type: String, required: true },
    subject_id: { type: Number, required: true },
});

module.exports = mongoose.model('department',departmentSchema);