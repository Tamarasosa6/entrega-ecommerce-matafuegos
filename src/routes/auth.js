const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailService = require('../services/mailService');

/**
 * Paso 1: Solicitar reset de contraseña
 */
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Usuario no encontrado');

        // Crear token y fecha de expiración (1 hora)
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600 * 1000;
        await user.save();

        // Enviar correo
        await mailService.sendResetPassword(email, token);
        res.send('Correo de recuperación enviado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno');
    }
});

/**
 * Paso 2: Mostrar formulario de reset de contraseña
 * (Si usas front, podes devolver HTML o JSON)
 */
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('Token inválido o expirado');

        res.send('Token válido. Podés enviar nueva contraseña mediante POST a esta misma ruta');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno');
    }
});

/**
 * Paso 3: Actualizar la contraseña
 */
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('Token inválido o expirado');

        // Evitar que ponga la misma contraseña
        const samePassword = await bcrypt.compare(newPassword, user.password);
        if (samePassword) return res.status(400).send('No podés usar la misma contraseña');

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Limpiar token y expiración
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.send('Contraseña actualizada correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno');
    }
});

module.exports = router;
