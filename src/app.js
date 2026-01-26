import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import { initPassport } from "./config/passport.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Handlebars config
const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "views", "partials")
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const mongoUri =
  process.env.MONGO_URL?.includes("mongodb://") || process.env.MONGO_URL?.includes("mongodb+srv://")
    ? `${process.env.MONGO_URL}/${process.env.DB_NAME || "entrega-final"}`
    : `mongodb://localhost:27017/${process.env.DB_NAME || "entrega-final"}`;

mongoose.connect(mongoUri)
  .then(() => console.log("Mongo conectado:", mongoUri))
  .catch((err) => console.error("Error Mongo:", err));

initPassport();
app.use(passport.initialize());

// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/", viewsRouter);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

const httpServer = app.listen(process.env.PORT || 8080, () => {
  console.log(`Servidor escuchando en puerto ${process.env.PORT || 8080}`);
});

export const io = new Server(httpServer);
