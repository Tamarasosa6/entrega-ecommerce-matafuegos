// user.model.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
  role: { type: String, default: "user" }
});

// Pre-save hook para encriptar la contraseña
userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10); // 10 salt rounds
  next();
});

// Método para comparar contraseña en login
userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;


