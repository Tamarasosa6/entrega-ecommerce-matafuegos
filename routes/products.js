const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager('../data/products.json');

module.exports = (io) => {
  // GET /api/products/
  router.get('/', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });

  // GET /api/products/:pid
  router.get('/:pid', async (req, res) => {
    try {
      const product = await productManager.getProductById(req.params.pid);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  });

  // POST /api/products/
  router.post('/', async (req, res) => {
    try {
      const product = req.body;
      await productManager.addProduct(product);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products); // Emitir actualización para WebSockets
      res.status(201).json({ message: 'Producto agregado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /api/products/:pid
  router.put('/:pid', async (req, res) => {
    try {
      const updatedFields = req.body;
      await productManager.updateProduct(req.params.pid, updatedFields);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products); // Emitir actualización para WebSockets
      res.json({ message: 'Producto actualizado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/products/:pid
  router.delete('/:pid', async (req, res) => {
    try {
      await productManager.deleteProduct(req.params.pid);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products); // Emitir actualización para WebSockets
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};



