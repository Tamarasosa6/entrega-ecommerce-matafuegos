const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Ticket = require('../models/ticket.model');
const crypto = require('crypto');

class CartRepository {

    async getById(id) {
        return Cart.findById(id).populate('products.product');
    }

    async addProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const existingProduct = cart.products.find(
            p => p.product.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        return cart.save();
    }

    async purchase(cartId, purchaserEmail) {

        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) return null;

        let total = 0;
        const productsNotProcessed = [];
        const productsProcessed = [];

        for (const item of cart.products) {

            if (item.product.stock >= item.quantity) {

                item.product.stock -= item.quantity;
                await item.product.save();

                total += item.product.price * item.quantity;
                productsProcessed.push(item);

            } else {
                productsNotProcessed.push(item);
            }
        }

        if (total === 0) {
            return {
                ticket: null,
                productsNotProcessed
            };
        }

        const ticket = await Ticket.create({
            code: crypto.randomBytes(6).toString('hex'),
            amount: total,
            purchaser: purchaserEmail
        });

        // Solo dejamos en el carrito los que NO se pudieron procesar
        cart.products = productsNotProcessed;
        await cart.save();

        return {
            ticket,
            productsNotProcessed
        };
    }
}

module.exports = CartRepository;
