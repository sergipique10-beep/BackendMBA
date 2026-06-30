require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const userRoutes = require("./src/routes/user.routes");
const postRoutes = require("./src/routes/post.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Ruta raíz — health check
app.get("/", (req, res) => {
  res.json({ message: "API BackendMBA funcionando correctamente 🚀", version: "1.0.0" });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Error interno del servidor" });
});

// Inicialización
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});

module.exports = app;
