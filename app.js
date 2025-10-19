require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');
const ProductManager = require('./managers/ProductManager');

const app = express();
const port = 8080;

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

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
app.use('/', viewsRouter);

// Rutas de vistas
app.get('/', async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render('home', { products: products.docs });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render('realTimeProducts', { products: products.docs });
});

// Configuración del servidor WebSocket
const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
const io = new Server(httpServer);

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        try {
            await ProductManager.addProduct(product);
            const updatedProducts = await ProductManager.getProducts();
            io.emit('updateProducts', updatedProducts.docs);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await ProductManager.deleteProduct(id);
            const updatedProducts = await ProductManager.getProducts();
            io.emit('updateProducts', updatedProducts.docs);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
});