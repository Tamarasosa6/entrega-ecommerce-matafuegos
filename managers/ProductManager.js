const Product = require('../models/Products');

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        const filter = query ? (query === 'available' ? { stock: { $gt: 0 } } : { category: query }) : {};
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
        };
        return Product.paginate(filter, options);
    }

    async getProductById(id) {
        return Product.findById(id);
    }

    async addProduct(product) {
        return new Product(product).save();
    }

    async updateProduct(id, updates) {
        return Product.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteProduct(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductManager();