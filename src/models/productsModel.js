const mongoose = require ('mongoose');

const productsSchema = new mongoose.Schema({
    kodeProducts: {
        type: String,
        required: true
    },
    productsName: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    stock: {
        type: Number
    }

})

module.exports  = mongoose.model('Products', productsSchema);
