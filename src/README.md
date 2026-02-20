echo "# Entrega 1: API de Matafuegos
API RESTful para gestionar matafuegos y carritos, desarrollada con Node.js, Express y persistencia en JSON.

## Instalación
1. Clona el repositorio: \`git clone https://github.com/Tamarasosa6/entrega-ecommerce.git\`
2. Instala dependencias: \`npm install\`
3. Inicia el servidor: \`node app.js\`

## Estructura
- \`app.js\`: Servidor principal.
- \`data/\`: Archivos JSON para persistencia (\`products.json\`, \`carts.json\`).
- \`managers/\`: Lógica de gestión (\`ProductManager.js\`, \`CartManager.js\`).
- \`routes/\`: Rutas de la API (\`products.js\`, \`carts.js\`).

## Endpoints
### Productos
- **GET /api/products/**: Lista todos los matafuegos.
- **GET /api/products/:pid**: Obtiene un matafuego por ID.
- **POST /api/products/**: Agrega un matafuego.
- **PUT /api/products/:pid**: Actualiza un matafuego.
- **DELETE /api/products/:pid**: Elimina un matafuego.

### Carritos
- **POST /api/carts/**: Crea un carrito.
- **GET /api/carts/:cid**: Lista los productos del carrito.
- **POST /api/carts/:cid/product/:pid**: Agrega un matafuego al carrito.

## Ejemplo de Matafuego
\`\`\`json
{
  \"title\": \"Matafuego CO2 5kg\",
  \"description\": \"Extintor de dióxido de carbono para incendios eléctricos\",
  \"code\": \"CO25KG001\",
  \"price\": 103987,
  \"stock\": 20,
  \"category\": \"Seguridad Industrial\",
  \"type\": \"CO2\",
  \"capacity\": \"5kg\",
  \"certifications\": [\"IRAM\"],
  \"thumbnails\": [\"/images/matafuego_co2_5kg.jpg\"]
}
\`\`\`

## Pruebas
Usa Postman para probar los endpoints en \`http://localhost:8080\`.
" > README.md
