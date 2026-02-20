const Cart = require('./models/cart.model');

class CartDAO {
    create() {
        return Cart.create({ products: [] });
    }

    getById(id) {
        return Cart.findById(id).populate('products.product');
    }

    update(id, data) {
        return Cart.findByIdAndUpdate(id, data, { new: true });
    }
}

module.exports = CartDAO;
