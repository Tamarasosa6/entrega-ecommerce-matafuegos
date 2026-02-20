require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
    JWT_SECRET: process.env.JWT_SECRET || "coderSecret"
};
