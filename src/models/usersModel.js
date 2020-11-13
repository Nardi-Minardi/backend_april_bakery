const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },

    resetPasswordLink: {
        data: String,
        default: ""
    }
}, {
    timestamps: true
})

// usersSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ id: this._id }, 'secretKey', { expiresIn: '7d' })
//     return token;
// }

module.exports = mongoose.model('Users', usersSchema);