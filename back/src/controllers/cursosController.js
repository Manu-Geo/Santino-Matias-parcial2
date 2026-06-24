const { sql, getConnection } = require("../config/db");


async function probarConexion(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().query("SELECT 1 AS ok");
    res.json({ ok: true, mensaje: "Conexión correcta con SQL Server", resultado: resultado.recordset });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "No se pudo conectar con SQL Server", error: error.message });
  }
}


async function obtenerCursos(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().query(`
      SELECT Id, Nombre, Categoria, Duracion, CuposDisponibles, Activo
      FROM Cursos
      ORDER BY Id DESC
    `);
    res.json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los cursos", error: error.message });
  }
}


async function obtenerCursoPorId(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const resultado = await pool.request()
      .input("id", sql.Int, Number(id))
      .query(`
        SELECT Id, Nombre, Categoria, Duracion, CuposDisponibles, Activo 
        FROM Cursos 
        WHERE Id = @id
      `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(resultado.recordset[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el curso", error: error.message });
  }
}


async function crearCurso(req, res) {
  try {
    const { nombre, categoria, duracion, cuposDisponibles, activo } = req.body;

    if (!nombre || !categoria || duracion === undefined || cuposDisponibles === undefined) {
      return res.status(400).json({ mensaje: "Debe completar todos los datos obligatorios" });
    }

    const pool = await getConnection();
    
   
    await pool.request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("categoria", sql.NVarChar(100), categoria)
      .input("duracion", sql.Int, Number(duracion))
      .input("cuposDisponibles", sql.Int, Number(cuposDisponibles))
      .input("activo", sql.Bit, activo === undefined ? true : (activo === true || activo === "true"))
      .query(`
        INSERT INTO Cursos (Nombre, Categoria, Duracion, CuposDisponibles, Activo)
        VALUES (@nombre, @categoria, @duracion, @cuposDisponibles, @activo)
      `);

   
    res.status(201).json({ mensaje: "Curso guardado correctamente" });

  } catch (error) {
    
    console.log("=== ERROR DETECTADO EN LA BASE DE DATOS ===");
    console.error(error.message);
    console.log("==========================================");
    
    res.status(500).json({ mensaje: "Error al guardar el curso", error: error.message });
  }
}


async function eliminarCurso(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const resultado = await pool.request()
      .input("id", sql.Int, Number(id))
      .query("DELETE FROM Cursos WHERE Id = @id");

   
    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json({ mensaje: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el curso", error: error.message });
  }
}


module.exports = { 
  probarConexion, 
  obtenerCursos, 
  obtenerCursoPorId, 
  crearCurso, 
  eliminarCurso 
};