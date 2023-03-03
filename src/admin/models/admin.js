const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobile_number: {type:String, required:true},
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    password: { type: String, required: false },
    image: { type: String, required: false }
    // image: { data: Buffer, contentType:String }

});

module.exports = mongoose.model('tbl_user', userSchema);