// routes/sessions.router.js
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "coderSecret";
const JWT_EXPIRES_IN = "1h"; // token expira en 1 hora

/* ================== REGISTER ================== */
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // Validar que el usuario no exista
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ status: "error", message: "Email ya registrado" });

    // Crear usuario (la contraseña se encripta automáticamente en el pre-save hook)
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password,
      role: role || "user",
    });

    await newUser.save();

    // No enviamos password en la respuesta
    const userResponse = { _id: newUser._id, first_name, last_name, email, age, role: newUser.role };

    res.status(201).json({ status: "success", payload: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al registrar usuario" });
  }
});

/* ================== LOGIN ================== */
router.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) return next(err);
      if (!user) return res.status(401).json({ status: "error", message: info.message });

      // Generar token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        status: "success",
        payload: { token, user: { email: user.email, role: user.role } },
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

/* ================== CURRENT ================== */
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json({ status: "success", payload: req.user });
  }
);

export default router;
