const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    owner: { type: String, default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

