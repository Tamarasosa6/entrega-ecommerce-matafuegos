const express = require('express');
const passport = require('passport');
const authorizeRole = require('../middlewares/authorization.middleware');

const ProductDAO = require('../dao/product.dao');
const ProductRepository = require('../repositories/product.repository');

const router = express.Router();

// 🔥 Inyectamos el DAO dentro del Repository
const productRepo = new ProductRepository(new ProductDAO());


// ===============================
// GET ALL
// ===============================
router.get('/', async (req, res) => {
    try {
        const products = await productRepo.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ===============================
// GET BY ID
// ===============================
router.get('/:pid', async (req, res) => {
    try {
        const product = await productRepo.getById(req.params.pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ===============================
// CREATE (solo admin)
// ===============================
router.post('/',
    passport.authenticate('current', { session: false }),
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const newProduct = await productRepo.create({
                ...req.body,
                owner: 'admin'
            });

            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


// ===============================
// UPDATE (solo admin)
// ===============================
router.put('/:pid',
    passport.authenticate('current', { session: false }),
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const updated = await productRepo.update(req.params.pid, req.body);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


// ===============================
// DELETE (solo admin)
// ===============================
router.delete('/:pid',
    passport.authenticate('current', { session: false }),
    authorizeRole('admin'),
    async (req, res) => {
        try {
            await productRepo.delete(req.params.pid);
            res.json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
