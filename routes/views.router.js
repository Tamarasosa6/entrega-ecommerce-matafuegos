const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager'); // Corregido: desde managers/

const productManager = new ProductManager('../data/products.json'); // Ajustado: ruta desde routes/

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;