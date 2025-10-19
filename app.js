require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const { Server } = require('socket.io');
const path = require('path');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');
const Cart = require('./models/Carts');

const app = express();
const port = 8080;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.engine('handlebars', handlebars.engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(async (req, res, next) => {
    if (!req.session.cartId) {
        const cart = new Cart({ products: [] });
        await cart.save();
        req.session.cartId = cart._id;
    }
    res.locals.cartId = req.session.cartId;
    next();
});

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});