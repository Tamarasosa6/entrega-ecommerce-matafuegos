const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor() {
    this.path = path.join(__dirname, '../data/carts.json');
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.#readFile();
    const id = carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readFile();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;
    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1; // Incrementa si existe
    }
    await this.#writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
