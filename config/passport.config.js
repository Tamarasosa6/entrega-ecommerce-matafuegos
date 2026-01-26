import passport from "passport";
import jwt from "passport-jwt";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const JWT_SECRET = process.env.JWT_SECRET || "coderSecret";

export default function initializePassport() {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id).lean();
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}
