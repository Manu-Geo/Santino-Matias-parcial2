const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importamos las rutas de cursos apuntando a tu carpeta './route'
const cursosRoutes = require("./route/cursosRoutes");

// Si en tu cursosController creaste una función para probar la conexión, la importas así:
// const { probarConexion } = require("./controllers/cursosController");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de cortesía para ver que la API esté viva
app.get("/", (req, res) => {
  res.send("API Sistema de Cursos funcionando perfectamente");
});

// Endpoint de prueba opcional (descoméntalo si implementas la función en tu controlador)
// app.get("/api/test-db", probarConexion);

// Enlazamos las rutas obligatorias solicitadas en el parcial (/api/cursos)
app.use("/api/cursos", cursosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});