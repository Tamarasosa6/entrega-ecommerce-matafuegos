const express = require('express');
const User = require('../models/User');
const { createHash } = require('../utils/hash');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  const newUser = await User.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password)
  });

  res.status(201).json({
    message: 'Usuario creado',
    user: newUser
  });
});

module.exports = router;
