🧯 Entrega Final - Ecommerce Matafuegos

Backend de ecommerce desarrollado con Node.js, Express y MongoDB.
Incluye autenticación con JWT, Passport, sistema de roles, carrito de compras y generación automática de tickets.

🚀 Tecnologías utilizadas

Node.js

Express

MongoDB

Mongoose

Passport

JSON Web Token (JWT)

Bcrypt

Nodemailer

Dotenv

📂 Estructura del proyecto
src/
│
├── config/         # Configuraciones (passport, etc.)
├── dao/            # Acceso a datos
├── dto/            # Data Transfer Objects
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de MongoDB
├── routes/         # Rutas del servidor
├── services/       # Lógica de negocio
├── utils/          # Funciones auxiliares
└── app.js          # Punto de entrada

⚙️ Instalación

1️⃣ Clonar el repositorio:

git clone https://github.com/Tamarasosa6/entrega-ecommerce-matafuegos.git


2️⃣ Entrar en la carpeta:

cd entrega-ecommerce-matafuegos


3️⃣ Instalar dependencias:

npm install


4️⃣ Crear archivo .env basado en .env.example

🔐 Variables de entorno necesarias

Crear un archivo .env con las siguientes variables:

PORT=8080
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_clave_secreta
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=tu_email
MAIL_PASS=tu_password
BASE_URL=http://localhost:8080

▶️ Ejecutar el proyecto

Modo desarrollo:

npm run dev


Modo producción:

npm start

🔑 Autenticación

El sistema implementa:

Passport para estrategias de autenticación

JWT almacenado en cookies HTTPOnly

Encriptación de contraseñas con Bcrypt

Roles implementados

user

admin

📦 Funcionalidades principales
👤 Usuarios

Registro

Login

Logout

Recuperación de contraseña

Endpoint /api/current con DTO

🛒 Carritos

Crear carrito

Agregar productos

Eliminar productos

Vaciar carrito

Finalizar compra

🛍 Productos

Crear producto (admin)

Editar producto (admin)

Eliminar producto (admin)

Listado con paginación

🎟 Compra y Ticket

Verificación de stock

Generación automática de ticket

Descuento de stock al confirmar compra

🔒 Seguridad

Passwords encriptadas

Validación de roles

Protección de rutas privadas

Manejo centralizado de errores

🧠 Arquitectura aplicada

DAO Pattern

Repository Pattern

DTO Pattern

Separación por capas

Middlewares personalizados

📌 Consideraciones

No subir el archivo .env

Incluir .env.example

Agregar node_modules al .gitignore

👩‍💻 Autor

Proyecto desarrollado como entrega final del curso Backend.