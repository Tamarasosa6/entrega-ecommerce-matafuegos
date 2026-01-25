// routes/users.router.js
import { Router } from "express";
import passport from "passport";
import UserModel from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.js";

const router = Router();

/* ================== GET ALL USERS ================== */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await UserModel.find().select("-password"); // No mostrar passwords
      res.json({ status: "success", payload: users });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error al obtener usuarios" });
    }
  }
);

/* ================== GET USER BY ID ================== */
router.get(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.uid).select("-password");
      if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
      res.json({ status: "success", payload: user });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error al obtener usuario" });
    }
  }
);

/* ================== CREATE USER ================== */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;

      // Validar duplicados
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) return res.status(400).json({ status: "error", message: "Email ya registrado" });

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password: hashPassword(password),
        role: role || "user",
      });

      await newUser.save();
      res.status(201).json({ status: "success", payload: newUser });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error al crear usuario" });
    }
  }
);

/* ================== UPDATE USER ================== */
router.put(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      // Si viene password, hashearla
      if (updateData.password) {
        updateData.password = hashPassword(updateData.password);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(req.params.uid, updateData, { new: true }).select("-password");
      if (!updatedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

      res.json({ status: "success", payload: updatedUser });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error al actualizar usuario" });
    }
  }
);

/* ================== DELETE USER ================== */
router.delete(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.uid).select("-password");
      if (!deletedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

      res.json({ status: "success", payload: deletedUser });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error al eliminar usuario" });
    }
  }
);

export default router;

