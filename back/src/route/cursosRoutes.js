const express = require("express");
const router = express.Router();

// Importamos las funciones correspondientes desde tu controlador de cursos
const { 
  obtenerCursos, 
  obtenerCursoPorId, 
  crearCurso, 
  eliminarCurso 
} = require("../controllers/cursosController");


router.get("/", obtenerCursos);          // GET /api/cursos
router.get("/:id", obtenerCursoPorId);   // GET /api/cursos/:id
router.post("/", crearCurso);            // POST /api/cursos
router.delete("/:id", eliminarCurso);    // DELETE /api/cursos/:id

module.exports = router;