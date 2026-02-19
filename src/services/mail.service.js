import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendRecoveryMail = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`;

    return await transport.sendMail({
        from: '"Ecommerce Coderhouse" <no-reply@ecommerce.com>',
        to: userEmail,
        subject: "Restablecimiento de contraseña",
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding:20px;">
                <h2>Hola! Has solicitado restablecer tu contraseña</h2>
                <p>Haz clic en el botón de abajo para crear una nueva contraseña. <b>Este enlace expirará en 1 hora.</b></p>
                <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                    Restablecer Contraseña
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            </div>
        `
    });
};