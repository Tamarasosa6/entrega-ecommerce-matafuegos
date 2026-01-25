// passport.config.js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const initializePassport = () => 
  /* ================== LOCAL STRATEGY ================== */
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          const isValid = user.isValidPassword(password);
          if (!isValid) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  /* ================== JWT STRATEGY ================== */
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id);
          if (user) return done(null, user);
          else return done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );