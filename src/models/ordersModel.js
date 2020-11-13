const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    idOrders: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    products: {
        type: Object,
        require: true
    }
},
    {
        timestamps: true,
    })

module.exports = mongoose.model("Orders", ordersSchema)