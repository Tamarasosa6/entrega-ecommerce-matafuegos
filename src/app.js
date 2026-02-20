// src/app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const config = require('./config/config');
const User = require('./models/user.model');
const UserDTO = require('./dto/user.dto');

// ===============================
// IMPORTAR RUTAS
// ===============================
const sessionsRouter = require('./routes/sessions');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const usersRouter = require('./routes/users');

// ===============================
// APP
// ===============================
const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// CONEXIÓN A MONGODB
// ===============================
mongoose.connect(config.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error MongoDB:", err));

// ===============================
// PASSPORT JWT STRATEGY
// ===============================
app.use(passport.initialize());

passport.use('current', new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT_SECRET
    },
    async (jwt_payload, done) => {
        try {
            const User = require('./models/user.model');
            const user = await User.findById(jwt_payload.id);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
));

// ===============================
// RUTAS
// ===============================
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);

// ===============================
// RUTA CURRENT (con DTO)
// ===============================
app.get('/api/current',
    passport.authenticate('current', { session: false }),
    (req, res) => {

        const userDTO = new UserDTO(req.user);

        res.json({
            status: 'success',
            user: userDTO
        });
    }
);

// ===============================
// RUTA BASE
// ===============================
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "🚀 Ecommerce Backend funcionando correctamente"
    });
});

// ===============================
// MIDDLEWARE GLOBAL DE ERRORES
// ===============================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Error interno del servidor"
    });
});

// ===============================
// SERVER
// ===============================
app.listen(config.PORT, () => {
    console.log(`🔥 Server running on port ${config.PORT}`);
});

module.exports = app;
