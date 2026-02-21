// utils/bcrypt.js
import bcrypt from "bcrypt";

// Hashea la contraseña
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Compara contraseña plana con hash
export const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
