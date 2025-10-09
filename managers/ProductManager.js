// managers/ProductManager.js
const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.validTypes = ['ABC', 'BC', 'CO2', 'AFFF', 'K', 'D'];
    }

    getProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    addProduct(product) {
        const products = this.getProducts();

        // Validar campos requeridos
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            throw new Error('Todos los campos (title, description, code, price, stock, category) son obligatorios');
        }

        // Validar el tipo de matafuego, si se proporciona
        if (product.type && !this.validTypes.includes(product.type)) {
            throw new Error('Tipo de matafuego inválido. Tipos permitidos: ' + this.validTypes.join(', '));
        }

        const newProduct = {
            id: this.generateId(products),
            title: product.title,
            description: product.description,
            code: product.code,
            price: parseFloat(product.price),
            status: true,
            stock: parseInt(product.stock),
            category: product.category,
            type: product.type || 'CO2', // Valor por defecto si no se proporciona 'type'
            thumbnails: product.thumbnails || [],
            certifications: product.certifications || []
        };

        // Verificar si el código ya existe
        if (products.some(p => p.code === newProduct.code)) {
            throw new Error('El código del producto ya existe');
        }

        products.push(newProduct);
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(id));
        fs.writeFileSync(this.path, JSON.stringify(filteredProducts, null, 2));
    }

    generateId(products) {
        return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }
}

module.exports = ProductManager;