const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    minQuantity: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

// export the model
module.exports = mongoose.model('Product', productSchema);