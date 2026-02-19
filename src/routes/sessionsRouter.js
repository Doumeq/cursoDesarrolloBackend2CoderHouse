import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";

import UserModel from "../dao/models/userModel.js";
import CartModel from "../dao/models/cartModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import UserDTO from "../dto/UserDTO.js";

dotenv.config();
const router = Router();

const COOKIE = process.env.COOKIE_NAME || "authToken";
const MAXAGE = Number(process.env.COOKIE_MAXAGE_MS || 86400000); 

router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ status: "error", error: "Email ya registrado" });

    const cart = await CartModel.create({ products: [] });

    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password),
      cart: cart._id
    });

    res.status(201).json({ status: "success", payload: { _id: user._id, email: user.email } });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status: "error", error: "Email y password son requeridos" });

    const user = await UserModel.findOne({ email}).populate("cart");
    if (!user || !comparePassword(password, user.password))
      return res.status(401).json({ status: "error", error: "Credenciales inválidas" });

    const userPublic = {
      _id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart?._id?.toString()
    };

    const token = jwt.sign({ user: userPublic }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    res
      .cookie(COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: MAXAGE })
      .json({ status: "success", payload: userPublic });
  } catch (e) { next(e); }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);

    res.json({ status: "success", payload: userDTO });
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE).json({ status: "success", message: "Sesión cerrada" });
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await sendRecoveryMail(email, token);
        
        res.json({ status: "success", message: "Correo de recuperación enviado con éxito." });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ status: "error", error: "Faltan datos (token o nueva contraseña)" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ status: "error", error: "El enlace es inválido o ha expirado. Solicita uno nuevo." });
        }

        const user = await UserModel.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ status: "error", error: "Usuario no encontrado" });

        if (comparePassword(newPassword, user.password)) {
            return res.status(400).json({ status: "error", error: "No puedes usar la misma contraseña que ya tenías." });
        }

        user.password = hashPassword(newPassword);
        await user.save();

        res.json({ status: "success", message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

export default router;