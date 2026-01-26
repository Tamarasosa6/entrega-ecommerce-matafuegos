import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "coderSecret";

/* ================== AUTHENTICATION ================== */
// Verifica JWT y carga el usuario en req.user
export const checkAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Token faltante",
      });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado",
    });
  }
};

/* ================== AUTHORIZATION ================== */
// Solo ADMIN
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Usuario no autenticado",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Acceso solo para administradores",
    });
  }

  next();
};

// USER o ADMIN
export const isUserOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Usuario no autenticado",
    });
  }

  if (req.user.role !== "user" && req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "No tenés permisos",
    });
  }

  next();
};
