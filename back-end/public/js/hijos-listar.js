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
      text: error.message || 'No se pudo obtener la información del hijo.'
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
          text: 'No se encontró el id del hijo para eliminar',
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
        return;
      }

      const result = await Swal.fire({
        title: '¿Seguro que deseas eliminar el registro de este hijo?',
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
