const mongoose = require('mongoose');

//layout of object (class)
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true}
});

//model is the object itself
module.exports = mongoose.model('Product', productSchema);