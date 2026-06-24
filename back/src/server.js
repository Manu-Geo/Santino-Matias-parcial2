const express = require("express");
const cors = require("cors");
require("dotenv").config();


const cursosRoutes = require("./route/cursosRoutes");


const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API Sistema de Cursos funcionando perfectamente");
});


app.use("/api/cursos", cursosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});