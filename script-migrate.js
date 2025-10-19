const mongoose = require('mongoose');
const Product = require('./models/products');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
      const products = JSON.parse(fs.readFileSync('./data/products.json'));
      const productsToInsert = products.map(({ id, ...rest }) => rest);
      await Product.deleteMany({});
      await Product.insertMany(productsToInsert);
      console.log('Datos migrados');
      mongoose.connection.close();
  })
  .catch(err => console.error('Error al migrar datos:', err));