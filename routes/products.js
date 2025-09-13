const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los matafuegos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(Number(req.params.pid));
    if (!product) return res.status(404).json({ error: 'Matafuego no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el matafuego' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, type, capacity, certifications, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category || !type || !capacity) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: title, description, code, price, stock, category, type, capacity' });
  }
  try {
    const newProduct = await productManager.addProduct({
      title, description, code, price, stock, category, type, capacity,
      certifications: certifications || [], thumbnails: thumbnails || []
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const { id, ...updatedFields } = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(Number(req.params.pid), updatedFields);
    if (!updatedProduct) return res.status(404).json({ error: 'Matafuego no encontrado' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(Number(req.params.pid));
    if (!deleted) return res.status(404).json({ error: 'Matafuego no encontrado' });
    res.json({ message: 'Matafuego eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el matafuego' });
  }
});

module.exports = router;
