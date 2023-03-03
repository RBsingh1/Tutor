const mongoose = require("mongoose")
const BanerSchema = mongoose.Schema({
    banner_title: { type: String, required: true },
    banner_status: { type: String, required: true },
    banner_image: { type: String, required: true }
})
module.exports = mongoose.model('banner', BanerSchema);