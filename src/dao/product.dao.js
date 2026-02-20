const Product = require('../models/product.model');

class ProductDAO {

    async getAll() {
        return await Product.find();
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async create(data) {
        return await Product.create(data);
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductDAO;
