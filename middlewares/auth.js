// middlewares/auth.js
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "coderSecretJWT";

// Middleware para proteger rutas con JWT
export const checkAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ status: "error", message: "Token faltante" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token)
      return res.status(401).json({ status: "error", message: "Token inválido" });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ status: "error", message: "Token inválido" });

    // Opcional: traer usuario desde DB
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ status: "error", message: "Usuario no encontrado" });

    req.user = user; // agregamos el usuario al request
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Token inválido o expirado" });
  }
};
