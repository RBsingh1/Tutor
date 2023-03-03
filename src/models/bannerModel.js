const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    banner_name: {
        required: true,
        type: String
    },
    banner_description: {
        required: true,
        type: Number
    },
    banner_url: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('banners', dataSchema)