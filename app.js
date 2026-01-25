import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

// Routers
import productRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js"; // <--- nuevo
import viewsRouter from "./routes/views.js";

// Passport config
import initializePassport from "./config/passport.config.js";

// Models
import Cart from "./models/Carts.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

/* ================== MONGODB ================== */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

/* ================== MIDDLEWARES ================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* ================== SESSION ================== */
app.use(
  session({
    secret: "coderSecret",
    resave: false,
    saveUninitialized: false,
  })
);

/* ================== PASSPORT ================== */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/* ================== HANDLEBARS ================== */
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

/* ================== CART SESSION ================== */
app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    const cart = new Cart({ products: [] });
    await cart.save();
    req.session.cartId = cart._id;
  }
  res.locals.cartId = req.session.cartId;
  next();
});

/* ================== ROUTES ================== */
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter); // <--- agregado
app.use("/", viewsRouter);

/* ================== SERVER ================== */
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");
});


