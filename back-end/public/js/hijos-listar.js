const tablaHijosBody = document.querySelector("#tablaHijos tbody"); 

async function cargarTablaHijos() {
  const idPadre = localStorage.getItem('padreId');
  try {
    const response = await fetch(`http://localhost:3000/hijos/padre/${idPadre}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Error al cargar grados');

    const listaHijos = await response.json();

    // Limpiar tabla antes de cargar
    tablaHijosBody.innerHTML = "";

    listaHijos.forEach(hijo => {

      const infoGradoHijo = Array.isArray(hijo.grado)
      ? hijo.grado.map(g => g.nombre).join(", ")
      : "";

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${hijo.nombre}</td>
        <td>${hijo.apellidos}</td>
        <td>${hijo.cedula}</td>
        <td  class="text-center">${infoGradoHijo}</td>
        <td class="text-center">
          <button class="btnEditar btnEditarHijo btn btn-sm btn-primary" data-id="${hijo._id}">Editar</button>
        </td>
        <td class="text-center">
          <button class="btnEliminarUsuario btnEliminarHijo btn btn-sm btn-danger" data-id="${hijo._id}">Eliminar</button>
        </td>
      `;

      tablaHijosBody.appendChild(fila);

    });
    eliminarHijos();

    // Agregar eventos a los botones "Editar"
    // Para evitar múltiples bindings, removemos listeners previos
    document.querySelectorAll(".btnEditarHijo").forEach(btn => {
      btn.removeEventListener("click", editarHijoHandler);
      btn.addEventListener("click", editarHijoHandler);
    });

  } catch (error) {
    console.error("Error al cargar la tabla:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cargar los hijos.',
    });
  }
}

// Handler para click en botón editar
async function editarHijoHandler(event) {
    
  const id = this.dataset.id;

  try {
    const response = await fetch(`http://localhost:3000/hijos/${id}`);
    if (!response.ok) throw new Error('Error al obtener datos del hijo');

    const hijo = await response.json();

    // Rellenar los campos del formulario con los datos del grado
    document.getElementById("editarIdHijo").value = hijo._id;
    document.getElementById("editarNombreHijo").value = hijo.nombre || '';
    document.getElementById("editarApellidosHijo").value = hijo.apellidos || '';
    document.getElementById("editarCedulaHijo").value = hijo.cedula || '';
    
    
    // Asignar valores al select Lista
    const selectGrados = document.getElementById("editarGradoHijo");
    if (hijo.grado && Array.isArray(hijo.grado)) {
      const valoresGrados = hijo.grado.map(g => g._id || g);
      for (let option of selectGrados .options) {
        option.selected = valoresGrados.includes(option.value);
      }
    } else {
      // Limpiar selección
      Array.from(selectGrados.options).forEach(opt => opt.selected = false);
    }

    // Mostrar el modal
    const modalElement = document.getElementById("editarHijoModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Preparar listener para botón Guardar solo una vez
    const btnGuardarEdicionHijo = document.getElementById("btnGuardarEdicionHijo");
    if (btnGuardarEdicionHijo) {
      // Eliminar cualquier listener anterior para evitar multiples ejecuciones
      btnGuardarEdicionHijo.replaceWith(btnGuardarEdicionHijo.cloneNode(true));
      const nuevoBtn = document.getElementById("btnGuardarEdicionHijo");

      nuevoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        actualizarHijo(modal);
      });
    }

  } catch (error) {
    console.error("Error al obtener datos del grado:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo obtener la información del grado.'
    });
  }
}

async function actualizarHijo(modalInstance) {

  const id = document.getElementById("editarIdHijo").value;
  const nombre = document.getElementById("editarNombreHijo").value.trim();
  const apellidos = document.getElementById("editarApellidosHijo").value.trim();
  const cedula = document.getElementById("editarCedulaHijo").value.trim();

  // Para los selects de grado y estado, si son múltiples:
  const selectGradoHijo = document.getElementById("editarGradoHijo");

  // Obtener array de valores seleccionados (IDs)
  const gradosSeleccionadosHijo = Array.from(selectGradoHijo.selectedOptions).map(option => option.value);

  if (!nombre) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'El nombre es obligatorio.',
    });
    return;
  }

  const datosActualizadosHijo = {
    nombre,
    apellidos,
    cedula,
    grado: gradosSeleccionadosHijo
  };

  try {
    const response = await fetch(`http://localhost:3000/hijos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosActualizadosHijo)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ msj: 'Error desconocido' }));
      throw new Error(errorData.msj || "Error al actualizar información de hijo");
    }

    Swal.fire({
      icon: "success",
      title: "Hijo actualizado",
      timer: 1500,
      showConfirmButton: false,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    // Cerrar modal si se pasó como parámetro, si no lo busca dinámicamente
    if (modalInstance) {
      modalInstance.hide();
    } else {
      const modal = bootstrap.Modal.getInstance(document.getElementById("editarHijoModal"));
      if (modal) modal.hide();
    }

    // Recargar tabla para mostrar los cambios
    cargarTablaHijos();

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || "Error al actualizar información de hijo",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }
}

// Cargar tabla cuando cargue el script
cargarTablaHijos();

document.addEventListener("DOMContentLoaded", () => {
  const idPadre = localStorage.getItem('padreId');
  const crearHijo = document.getElementById("hijoForm");

  const inputNombreHijo = document.getElementById("registrarNombreHijo");
  const inputApellidosHijo = document.getElementById("registrarApellidosHijo");
  const inputCedulaHijo = document.getElementById("registrarCedulaHijo");
  const inputGradoHijo = document.getElementById("registrarGradoHijo");

  async function registrarHijo() {
    const datosRegistroHijo = {
      nombre: inputNombreHijo.value.trim(),
      apellidos: inputApellidosHijo.value.trim(),
      cedula: inputCedulaHijo.value.trim(),
      idPadre: idPadre,
      grado: [inputGradoHijo.value]
    };

    try {
      const response = await fetch("http://localhost:3000/hijos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosRegistroHijo)
      });

      if (!response.ok) {
        let errorMessage = "Error desconocido";

        try {
          // Intentamos obtener mensaje de error JSON si existe
          const errorData = await response.json();
          errorMessage = errorData.msj || errorData.message || errorMessage;
        } catch (e) {
          // Si no hay JSON en la respuesta, se ignora y se usa mensaje por defecto
        }

        Swal.fire({
          icon: response.status === 400 ? "error" : "error",
          title: response.status === 400 ? "Hijo duplicado" : "Error de servidor",
          text: errorMessage,
          showClass: { popup: "animate__animated animate__shakeX" },
          hideClass: { popup: "animate__animated animate__fadeOutUp" }
        });
        return;
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "¡Registro realizado exitosamente!",
        showConfirmButton: false,
        timer: 2000,
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" }
      });

      // Aquí debes tener definida la función cargarTablaGrados que refresca la tabla
      cargarTablaHijos();

      // Limpiar campos y clases de error
      inputNombreHijo.value = "";
      inputApellidosHijo.value = "";
      inputCedulaHijo.value = "";
      inputGradoHijo.value = "";

      inputNombreHijo.classList.remove("is-invalid");
      inputApellidosHijo.classList.remove("is-invalid");
      inputCedulaHijo.classList.remove("is-invalid");
      inputGradoHijo.classList.remove("is-invalid");

      // Cerrar modal correctamente
      const crearHijoModal = document.getElementById("hijoModal");
      const modalInstance =
        bootstrap.Modal.getInstance(crearHijoModal) || new bootstrap.Modal(crearHijoModal);
      modalInstance.hide();

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "No se pudo conectar con el servidor.",
        showClass: { popup: "animate__animated animate__shakeX" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" }
      });
    }
  }

  if (crearHijo) {
    crearHijo.addEventListener("submit", (e) => {
      e.preventDefault();

      // Asegúrate de tener definida la función validar(), si no pon true
      if (typeof validar === "function" ? validar() : true) {
        registrarHijo();
      }
    });
  }
});


// Función para asignar evento eliminar a botones de la tabla
function eliminarHijos() {
  document.querySelectorAll(".btnEliminarHijo").forEach(btn => {
    btn.addEventListener("click", async function() {
      const id = this.dataset.id;
      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró el id del grado para eliminar',
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
        return;
      }

      const result = await Swal.fire({
        title: '¿Seguro que deseas eliminar este grado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });

      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/hijos/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (!res.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.msj || 'Error al eliminar hijo',
              showClass: { popup: 'animate__animated animate__shakeX' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Hijo eliminado',
            showConfirmButton: false,
            timer: 1500,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });

          // Recargar tabla
          cargarTablaHijos();

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en el servidor al eliminar hijo',
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
        }
      }
    });
  });
}

// Cargar tabla listas 

const contenedorHijosListas = document.getElementById("contenedorHijosListas");

async function cargarHijosYListas() {
  const idPadre = localStorage.getItem('padreId');

  try {
    const responseHijos = await fetch(`http://localhost:3000/hijos/padre/${idPadre}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!responseHijos.ok) throw new Error("Error al cargar hijos");

    const listaHijos = await responseHijos.json();

    // Limpiar contenedor principal
    contenedorHijosListas.innerHTML = "";

    // Recorrer cada hijo
    for (const hijo of listaHijos) {
      // Crear título hijo
      const tituloHijo = document.createElement("h3");
      tituloHijo.textContent = `${hijo.nombre} ${hijo.apellidos}`;

      // Agregar al contenedor
      contenedorHijosListas.appendChild(tituloHijo);

      // Obtener ids de grados del hijo
      const gradosIds = (Array.isArray(hijo.grado)) ? hijo.grado.map(g => g._id || g) : [];

      if (gradosIds.length === 0) {
        const avisoSinGrados = document.createElement("p");
        avisoSinGrados.textContent = "No tiene grados asignados.";
        contenedorHijosListas.appendChild(avisoSinGrados);
        continue; // pasa al siguiente hijo
      }

      // Llamar a la ruta que busca listas por grados
      const paramsIds = gradosIds.join(",");
      const responseListas = await fetch(`http://localhost:3000/lista-utiles/por-grados?ids=${paramsIds}`, {
        headers: { "Content-Type": "application/json" }
      });

      if (!responseListas.ok) {
        const errorMsg = await responseListas.json().catch(() => ({}));
        const pError = document.createElement("p");
        pError.textContent = errorMsg.msj || "Error al cargar listas para los grados";
        contenedorHijosListas.appendChild(pError);
        continue;
      }

      const listasUtiles = await responseListas.json();

      if (!Array.isArray(listasUtiles) || listasUtiles.length === 0) {
        const pSinListas = document.createElement("p");
        pSinListas.textContent = "No hay listas asociadas a los grados de este hijo.";
        contenedorHijosListas.appendChild(pSinListas);
        continue;
      }

      // Por cada lista, generar tabla
      listasUtiles.forEach(lista => {
        const tabla = document.createElement("table");
        tabla.classList.add("table", "table-bordered", "mb-4");

        const thead = document.createElement("thead");
        const trTitulo = document.createElement("tr");
        const thTitulo = document.createElement("th");
        thTitulo.colSpan = 3;
        thTitulo.classList.add("bg-primary", "text-white", "text-center");
        thTitulo.textContent = lista.nombre || "Lista sin nombre";
        trTitulo.appendChild(thTitulo);
        thead.appendChild(trTitulo);

        // Encabezados de columnas para los útiles
        const trHeaderUtiles = document.createElement("tr");
        ["Nombre", "Descripción", "Cantidad"].forEach(texto => {
          const th = document.createElement("th");
          th.textContent = texto;
          th.classList.add("text-center");
          trHeaderUtiles.appendChild(th);
        });
        thead.appendChild(trHeaderUtiles);

        tabla.appendChild(thead);

        const tbody = document.createElement("tbody");

        if (Array.isArray(lista.utiles) && lista.utiles.length > 0) {
          lista.utiles.forEach(util => {
            const tr = document.createElement("tr");

            const tdNombre = document.createElement("td");
            tdNombre.textContent = util.nombre || "-";

            const tdDescripcion = document.createElement("td");
            tdDescripcion.textContent = util.descripcion || "-";

            // Cantidad puede no venir en util, o debes ajustar ese dato según tu modelo
            const tdCantidad = document.createElement("td");
            tdCantidad.textContent = (util.cantidad !== undefined) ? util.cantidad : "-";
            tdCantidad.classList.add("text-center");

            tr.appendChild(tdNombre);
            tr.appendChild(tdDescripcion);
            tr.appendChild(tdCantidad);

            tbody.appendChild(tr);
          });
        } else {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 3;
          td.classList.add("text-center");
          td.textContent = "No hay útiles para esta lista.";
          tr.appendChild(td);
          tbody.appendChild(tr);
        }

        tabla.appendChild(tbody);
        contenedorHijosListas.appendChild(tabla);
      });

    }

  } catch (error) {
    console.error("Error al cargar hijos y listas:", error);
    contenedorHijosListas.innerHTML = "<p class='text-danger'>Error al cargar los datos.</p>";
  }
}

cargarHijosYListas();
