// src/services/mailService.js

const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true, // true si usás 465
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendResetPassword(email, token) {

        const resetLink = `${process.env.BASE_URL}/api/users/reset-password/${token}`;

        await this.transporter.sendMail({
            from: `"Ecommerce Matafuegos" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Recuperación de contraseña",
            html: `
                <h2>Recuperación de contraseña</h2>
                <p>Hacé click en el botón para restablecer tu contraseña.</p>
                <a href="${resetLink}" 
                   style="padding:10px 20px;background:#ff3b3b;color:#fff;text-decoration:none;border-radius:5px;">
                   Restablecer contraseña
                </a>
                <p>Este enlace expira en 1 hora.</p>
            `
        });
    }
}

module.exports = new MailService();
