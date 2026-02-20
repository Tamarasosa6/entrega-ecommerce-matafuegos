const express = require('express');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/user.repository');
const { generateToken } = require('../utils/jwt');

const router = express.Router();
const userRepo = new UserRepository();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await userRepo.create({
            ...req.body,
            password: hashedPassword
        });

        res.json({ status: 'success', user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepo.getByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user);

    res.json({ token });
});

module.exports = router;
