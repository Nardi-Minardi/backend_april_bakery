const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    resetPasswordLink: {
        data: String,
        default: ""
    }

})

module.exports = mongoose.model('Users', usersSchema);