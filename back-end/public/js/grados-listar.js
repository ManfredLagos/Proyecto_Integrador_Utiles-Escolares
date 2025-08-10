const tablaGradosBody = document.querySelector("#tablaGrados tbody"); 

async function cargarTablaGrados() {
  try {
    const response = await fetch("http://localhost:3000/grado", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Error al cargar grados');

    const listaGrados = await response.json();

    // Limpiar tabla antes de cargar
    tablaGradosBody.innerHTML = "";

    listaGrados.forEach(grado => {

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${grado.nombre}</td>
        <td>${grado.descripcion}</td>
        <td>${grado.grado}</td>
        <td class="text-center">
          <button class="btnEditarGrado btn btn-sm btn-primary" data-id="${grado._id}">Editar</button>
        </td>
        <td class="text-center">
          <button class="btnEliminarGrado btn btn-sm btn-danger" data-id="${grado._id}">Eliminar</button>
        </td>
      `;

      tablaGradosBody.appendChild(fila);

    });
    eliminarGrado();

    // Agregar eventos a los botones "Editar"
    // Para evitar múltiples bindings, removemos listeners previos
    document.querySelectorAll(".btnEditarGrado").forEach(btn => {
      btn.removeEventListener("click", editarGradoHandler);
      btn.addEventListener("click", editarGradoHandler);
    });

  } catch (error) {
    console.error("Error al cargar la tabla:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cargar los grados.',
    });
  }
}

// Handler para click en botón editar
async function editarGradoHandler(event) {
  const id = this.dataset.id;

  try {
    const response = await fetch(`http://localhost:3000/grado/${id}`);
    if (!response.ok) throw new Error('Error al obtener datos del grado');

    const grado = await response.json();

    // Rellenar los campos del formulario con los datos del grado
    document.getElementById("editarIdGrado").value = grado._id;
    document.getElementById("editarNombreGrado").value = grado.nombre || '';
    document.getElementById("editarDescripcionGrado").value = grado.descripcion || '';
    document.getElementById("editarNivelGrado").value = grado.grado || '';

    // Mostrar el modal
    const modalElement = document.getElementById("editarGradoModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Preparar listener para botón Guardar solo una vez
    const btnGuardarEdicionGrado = document.getElementById("btnGuardarEdicionGrado");
    if (btnGuardarEdicionGrado) {
      // Eliminar cualquier listener anterior para evitar multiples ejecuciones
      btnGuardarEdicionGrado.replaceWith(btnGuardarEdicionGrado.cloneNode(true));
      const nuevoBtn = document.getElementById("btnGuardarEdicionGrado");

      nuevoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        actualizarGrado(modal);
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

async function actualizarGrado(modalInstance) {
  const id = document.getElementById("editarIdGrado").value;
  const nombre = document.getElementById("editarNombreGrado").value.trim();
  const descripcion = document.getElementById("editarDescripcionGrado").value.trim();
  const grado = document.getElementById("editarNivelGrado").value.trim();

  // Validaciones simples
  if (!id) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'ID del grado no válido.',
    });
    return;
  }

  if (!nombre) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'El nombre es obligatorio.',
    });
    return;
  }

  const cantidadNum = Number(grado);
  if (isNaN(cantidadNum) || cantidadNum < 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad inválida',
      text: 'Por favor, ingrese un nivel válida (número mayor o igual a 0).',
    });
    return;
  }

  const datosActualizadosGrado = {
    nombre,
    descripcion,
    grado: cantidadNum
  };

  try {
    const response = await fetch(`http://localhost:3000/grado/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosActualizadosGrado)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ msj: 'Error desconocido' }));
      throw new Error(errorData.msj || "Error al actualizar grado");
    }

    Swal.fire({
      icon: "success",
      title: "Grado actualizado",
      timer: 1500,
      showConfirmButton: false,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    // Cerrar modal si se pasó como parámetro, si no lo busca dinámicamente
    if (modalInstance) {
      modalInstance.hide();
    } else {
      const modal = bootstrap.Modal.getInstance(document.getElementById("editarGradoModal"));
      if (modal) modal.hide();
    }

    // Recargar tabla para mostrar los cambios
    cargarTablaGrados();

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || "Error al actualizar grado",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }
}

// Cargar tabla cuando cargue el script
cargarTablaGrados();

document.addEventListener("DOMContentLoaded", () => {
  const crearGrado = document.getElementById("crearGradoForm");

  const inputNombreGrado = document.getElementById("nombreGrado");
  const inputDescripcionGrado = document.getElementById("descripcionGrado");
  const inputNivelGrado = document.getElementById("nivelGrado");

  async function registrarGrado() {
    const datosRegistroGrado = {
      nombre: inputNombreGrado.value.trim(),
      descripcion: inputDescripcionGrado.value.trim(),
      grado: inputNivelGrado.value.trim(),
    };

    try {
      const response = await fetch("http://localhost:3000/grado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosRegistroGrado)
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
          title: response.status === 400 ? "Grado duplicado" : "Error de servidor",
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
      cargarTablaGrados();

      // Limpiar campos y clases de error
      inputNombreGrado.value = "";
      inputDescripcionGrado.value = "";
      inputNivelGrado.value = "";

      inputNombreGrado.classList.remove("is-invalid");
      inputDescripcionGrado.classList.remove("is-invalid");
      inputNivelGrado.classList.remove("is-invalid");

      // Cerrar modal correctamente
      const crearGradoModal = document.getElementById("crearGradoModal");
      const modalInstance =
        bootstrap.Modal.getInstance(crearGradoModal) || new bootstrap.Modal(crearGradoModal);
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

  if (crearGrado) {
    crearGrado.addEventListener("submit", (e) => {
      e.preventDefault();

      // Asegúrate de tener definida la función validar(), si no pon true
      if (typeof validar === "function" ? validar() : true) {
        registrarGrado();
      }
    });
  }
});


// Función para asignar evento eliminar a botones de la tabla
function eliminarGrado() {
  document.querySelectorAll(".btnEliminarGrado").forEach(btn => {
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
          const res = await fetch(`http://localhost:3000/grado/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (!res.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.msj || 'Error al eliminar grado',
              showClass: { popup: 'animate__animated animate__shakeX' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Grado eliminado',
            showConfirmButton: false,
            timer: 1500,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });

          // Recargar tabla
          cargarTablaGrados();

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en el servidor al eliminar grado',
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
        }
      }
    });
  });
}
