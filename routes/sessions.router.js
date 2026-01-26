// routes/sessions.router.js
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "coderSecret";
const JWT_EXPIRES_IN = "1h";

/* ================== REGISTER ================== */
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validaciones básicas
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El email ya está registrado",
      });
    }

    // Crear usuario
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password),
      role: "user",
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      payload: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ ERROR REGISTER:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/* ================== LOGIN ================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email y password son obligatorios",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      status: "success",
      payload: {
        token,
        user: {
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("❌ ERROR LOGIN:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/* ================== CURRENT ================== */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      status: "success",
      payload: req.user,
    });
  }
);

export default router;

