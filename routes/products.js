// routes/products.js
const express = require('express');
const ProductManager = require('../managers/ProductManager');
const fs = require('fs');

const router = express.Router();
const productManager = new ProductManager('./data/products.json');

router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const product = productManager.getProducts().find(p => p.id === parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    try {
        const product = productManager.addProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', (req, res) => {
    const products = productManager.getProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
    if (updatedProduct.type && !['ABC', 'BC', 'CO2', 'AFFF', 'K', 'D'].includes(updatedProduct.type)) {
        return res.status(400).json({ error: 'Tipo de matafuego inválido. Tipos permitidos: ABC, BC, CO2, AFFF, K, D' });
    }
    products[productIndex] = updatedProduct;
    fs.writeFileSync(productManager.path, JSON.stringify(products, null, 2));
    res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
    const products = productManager.getProducts();
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    productManager.deleteProduct(req.params.pid);
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;

