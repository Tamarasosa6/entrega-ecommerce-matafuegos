const Cart = require('../models/Cart');

class CartManager {
    async createCart() {
        return new Cart({ products: [] }).save();
    }

    async getCartById(id) {
        return Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cid, pid) {
        const cart = await this.getCartById(cid);
        const existing = cart.products.find(p => p.product.toString() === pid);
        if (existing) existing.quantity++;
        else cart.products.push({ product: pid });
        return cart.save();
    }

    async removeProductFromCart(cid, pid) {
        const cart = await this.getCartById(cid);
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        return cart.save();
    }

    async updateCart(cid, products) {
        return Cart.findByIdAndUpdate(cid, { products }, { new: true });
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await this.getCartById(cid);
        const product = cart.products.find(p => p.product.toString() === pid);
        if (product) product.quantity = quantity;
        return cart.save();
    }

    async clearCart(cid) {
        return Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    }
}

module.exports = new CartManager();
