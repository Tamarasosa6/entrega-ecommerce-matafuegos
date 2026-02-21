import bcrypt from "bcrypt";

// genera el hash de la contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// compara contraseña ingresada con la hasheada
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

