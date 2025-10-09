// app.js
const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
const ProductManager = require('./managers/ProductManager');

const app = express();
const port = 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Rutas de vistas
app.get('/', (req, res) => {
    const productManager = new ProductManager('./data/products.json');
    const products = productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    const productManager = new ProductManager('./data/products.json');
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});

// Configuración del servidor WebSocket
const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
const io = new Server(httpServer);

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', (product) => {
        try {
            const productManager = new ProductManager('./data/products.json');
            productManager.addProduct(product);
            const updatedProducts = productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('deleteProduct', (id) => {
        try {
            const productManager = new ProductManager('./data/products.json');
            productManager.deleteProduct(id);
            const updatedProducts = productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
});