const mongoose = require ('mongoose');

const productsSchema = new mongoose.Schema({
    idProducts: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    productsName: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: Object,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    categories: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false
    },
    sold: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true

    })

module.exports  = mongoose.model('Products', productsSchema);
