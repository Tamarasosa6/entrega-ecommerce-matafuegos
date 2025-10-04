const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const ProductManager = require('./managers/ProductManager'); // Corregido: desde managers/

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server);
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const productsRouter = require('./routes/products')(io); // Pasar io al router
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views.router');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configurar WebSockets
const productManager = new ProductManager('./data/products.json'); // Corregido: ruta a products.json
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejar adición de producto
  socket.on('addProduct', async (product) => {
    try {
      await productManager.addProduct(product);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  // Manejar eliminación de producto
  socket.on('deleteProduct', async (pid) => {
    try {
      await productManager.deleteProduct(pid);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
