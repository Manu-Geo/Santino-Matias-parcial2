
const API_URL = "http://localhost:3000/api/cursos";


const formCurso = document.getElementById("formCurso");
const listadoCursos = document.getElementById("listadoCursos");
const mensajeAlerta = document.getElementById("mensaje");


const btnCargar = document.getElementById("btnCargar");
const btnTodos = document.getElementById("btnTodos");
const btnConCupos = document.getElementById("btnConCupos");
const btnEstadisticas = document.getElementById("btnEstadisticas");


let cursosCache = [];


async function traerCursos() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
    
    
    cursosCache = await respuesta.json();
    mostrarTarjetas(cursosCache);
  } catch (error) {
    console.error("Error al traer cursos:", error);
    mostrarMensaje("No se pudo conectar con el servidor. ¿Está prendido el Backend?", "error");
  }
}


function mostrarTarjetas(listaDeCursos) {
  listadoCursos.innerHTML = ""; 

  if (listaDeCursos.length === 0) {
    listadoCursos.innerHTML = "<p>No hay cursos disponibles para mostrar.</p>";
    return;
  }

  listaDeCursos.forEach(curso => {
    
    const claseEstado = curso.Activo ? "curso-activo" : "curso-inactivo";
    const textoEstado = curso.Activo ? "Activo" : "Inactivo";
    const badgeEstadoClase = curso.Activo ? "estado-activo" : "estado-inactivo";

  
    const tarjeta = document.createElement("div");
    tarjeta.className = `tarjeta ${claseEstado}`;
    tarjeta.innerHTML = `
      <div class="tarjeta-header">
        <h3>${curso.Nombre}</h3>
        <span class="badge-categoria">${curso.Categoria}</span>
      </div>
      <div class="tarjeta-body">
        <p><strong>⏱️ Duración:</strong> ${curso.Duracion} meses</p>
        <p><strong>👥 Cupos Disponibles:</strong> ${curso.CuposDisponibles}</p>
      </div>
      <div class="tarjeta-footer">
        <span class="badge-estado ${badgeEstadoClase}">${textoEstado}</span>
        <button class="btn-eliminar" onclick="eliminarCurso(${curso.Id})">🗑️ Eliminar</button>
      </div>
    `;
    listadoCursos.appendChild(tarjeta);
  });
}


formCurso.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  
  const nombre = document.getElementById("nombre").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const duracion = document.getElementById("duracion").value;
  const cuposDisponibles = document.getElementById("cuposDisponibles").value;
  const activo = document.getElementById("activo").value === "true";

 
  const nuevoCurso = { nombre, categoria, duracion, cuposDisponibles, activo };

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCurso)
    });

    const data = await respuesta.json();

    if (respuesta.status === 201) {
      mostrarMensaje("¡Curso registrado con éxito!", "success");
      formCurso.reset(); 
      traerCursos();    
    } else {
      mostrarMensaje(data.mensaje || "Error al guardar", "error");
    }
  } catch (error) {
    mostrarMensaje("Error de red al intentar guardar el curso", "error");
  }
});


async function eliminarCurso(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este curso de la oferta académica?")) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await respuesta.json();

    if (respuesta.ok) {
      mostrarMensaje("Curso eliminado correctamente", "success");
      traerCursos(); 
    } else {
      mostrarMensaje(data.mensaje || "No se pudo eliminar", "error");
    }
  } catch (error) {
    mostrarMensaje("Error de red al intentar eliminar", "error");
  }
}

btnCargar.addEventListener("click", traerCursos);
btnTodos.addEventListener("click", () => mostrarTarjetas(cursosCache));

btnConCupos.addEventListener("click", () => {
  const filtrados = cursosCache.filter(c => c.CuposDisponibles > 0);
  mostrarTarjetas(filtrados);
});


btnEstadisticas.addEventListener("click", () => {
  const total = cursosCache.length;
  const activos = cursosCache.filter(c => c.Activo).length;
  const inactivos = total - activos;

  alert(`📊 ESTADÍSTICAS DE LA OFERTA ACADÉMICA:\n\n` +
        `• Total de Cursos registrados: ${total}\n` +
        `• Cursos Activos: ${activos}\n` +
        `• Cursos Inactivos: ${inactivos}`);
});




function mostrarMensaje(texto, tipo) {
  mensajeAlerta.innerText = texto;
  mensajeAlerta.style.color = tipo === "success" ? "#10b981" : "#ef4444";
  
 
  setTimeout(() => { mensajeAlerta.innerText = ""; }, 4000);
}


document.addEventListener("DOMContentLoaded", traerCursos);