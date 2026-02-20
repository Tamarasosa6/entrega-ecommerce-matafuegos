const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    amount: Number,
    purchaser: String
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
