const express = require('express');
const passport = require('passport');
const authorizeRole = require('../middlewares/authorization.middleware');
const CartRepository = require('../repositories/cart.repository');

const router = express.Router();
const cartRepo = new CartRepository();

// AGREGAR PRODUCTO AL CARRITO (solo user)
router.post('/:cid/product/:pid',
    passport.authenticate('current', { session: false }),
    authorizeRole('user'),
    async (req, res) => {

        const updatedCart = await cartRepo.addProduct(
            req.params.cid,
            req.params.pid
        );

        if (!updatedCart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
    }
);

// FINALIZAR COMPRA
router.post('/:cid/purchase',
    passport.authenticate('current', { session: false }),
    authorizeRole('user'),
    async (req, res) => {

        const result = await cartRepo.purchase(
            req.params.cid,
            req.user.email
        );

        if (!result)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        res.json(result);
    }
);

module.exports = router;
