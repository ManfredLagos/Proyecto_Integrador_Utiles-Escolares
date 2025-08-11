const tablaListasBody = document.querySelector("#tablaListas tbody"); 
// O si #tablaListas es el <tbody> directamente:
// const tablaListasBody = document.getElementById("tablaListas");

async function cargarTablaListas() {
  try {
    const response = await fetch("http://localhost:3000/lista-utiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Error al cargar útiles');

    const listaUtiles = await response.json();

    // Limpiar tabla antes de cargar
    tablaListasBody.innerHTML = "";

    listaUtiles.forEach(lista => {

      const infoUtil = Array.isArray(lista.utiles)
        ? lista.utiles.map(g => g.nombre).join(", ")
        : "";

      const infoGrado = Array.isArray(lista.grado)
            ? lista.grado.map(g => g.nombre).join(", ")
            : "";

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${lista.nombre}</td>
        <td>${lista.descripcion}</td>
        <td class="text-center">${infoUtil}</td>
        <td class="text-center">${infoGrado}</td>
        <td class="text-center">
          <button class="btnEditarLista btn btn-sm btn-primary" data-id="${lista._id}">Editar</button>
        </td>
        <td class="text-center">
          <button class="btnEliminarLista btn btn-sm btn-danger" data-id="${lista._id}">Eliminar</button>
        </td>
      `;

      tablaListasBody.appendChild(fila);

    });

    eliminarLista();

    // Agregar eventos a los botones "Editar"
    // Para evitar múltiples bindings, removemos listeners previos
    document.querySelectorAll(".btnEditarLista").forEach(btn => {
      btn.removeEventListener("click", editarListaHandler);
      btn.addEventListener("click", editarListaHandler);
    });

  } catch (error) {
    console.error("Error al cargar la tabla:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cargar las listas.',
    });
  }
}

// Handler para click en botón editar
async function editarListaHandler(event) {
  const id = this.dataset.id;

  try {
    const response = await fetch(`http://localhost:3000/lista-utiles/${id}`);
    if (!response.ok) throw new Error('Error al obtener datos de la lista');

    const util = await response.json();

    // Rellenar los campos del formulario con los datos del útil
    document.getElementById("editarIdLista").value = util._id;
    document.getElementById("editarNombreLista").value = util.nombre || '';
    document.getElementById("editarDescripcionLista").value = util.descripcion || '';

    // Asignar valores al select Lista
    const selectUtiles = document.getElementById("editarUtilesLista");
    if (lista.utiles && Array.isArray(lista.utiles)) {
      const valoresUtiles = lista.utiles.map(g => g._id || g);
      for (let option of selectUtiles .options) {
        option.selected = valoresUtiles.includes(option.value);
      }
    } else {
      // Limpiar selección
      Array.from(selectUtiles.options).forEach(opt => opt.selected = false);
    }

    // Asignar valores al select Lista
    const selectGrados = document.getElementById("editarGradosLista");
    if (lista.grado && Array.isArray(lista.grado)) {
      const valoresGrados = grado.utiles.map(g => g._id || g);
      for (let option of selectGrados .options) {
        option.selected = valoresGrados.includes(option.value);
      }
    } else {
      // Limpiar selección
      Array.from(selectGrados.options).forEach(opt => opt.selected = false);
    }

    // Mostrar el modal
    const modalElement = document.getElementById("editarListaModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Preparar listener para botón Guardar solo una vez
    const btnGuardarEdicionLista = document.getElementById("btnGuardarEdicionLista");
    if (btnGuardarEdicionLista) {
      // Eliminar cualquier listener anterior para evitar multiples ejecuciones
      btnGuardarEdicionLista.replaceWith(btnGuardarEdicionLista.cloneNode(true));
      const nuevoBtn = document.getElementById("btnGuardarEdicionLista");

      nuevoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        actualizarUtil(modal);
      });
    }

  } catch (error) {
    console.error("Error al obtener datos de la lista:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo obtener la información de la lista.'
    });
  }
}

async function actualizarUtil(modalInstance) {
  const id = document.getElementById("editarIdUtil").value;
  const nombre = document.getElementById("editarNombreUtil").value.trim();
  const descripcion = document.getElementById("editarDescripcionUtil").value.trim();
  const cantidad = document.getElementById("editarCantidadUtil").value.trim();

  const selectLista = document.getElementById("editarListaUtil");

  if (!selectLista) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró el campo Lista en el formulario.',
    });
    return;
  }

  const listasSeleccionadas = Array.from(selectLista.selectedOptions).map(option => option.value);

  // Validaciones simples
  if (!id) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'ID del útil no válido.',
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

  const cantidadNum = Number(cantidad);
  if (isNaN(cantidadNum) || cantidadNum < 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad inválida',
      text: 'Por favor, ingrese una cantidad válida (número mayor o igual a 0).',
    });
    return;
  }

  const datosActualizadosUtil = {
    nombre,
    descripcion,
    cantidad: cantidadNum,
    lista: listasSeleccionadas,
  };

  try {
    const response = await fetch(`http://localhost:3000/lista-utiles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosActualizadosUtil)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ msj: 'Error desconocido' }));
      throw new Error(errorData.msj || "Error al actualizar útil");
    }

    Swal.fire({
      icon: "success",
      title: "Útil actualizado",
      timer: 1500,
      showConfirmButton: false,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    // Cerrar modal si se pasó como parámetro, si no lo busca dinámicamente
    if (modalInstance) {
      modalInstance.hide();
    } else {
      const modal = bootstrap.Modal.getInstance(document.getElementById("editarUtilModal"));
      if (modal) modal.hide();
    }

    // Recargar tabla para mostrar los cambios
    cargarTablaListas();

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || "Error al actualizar útil",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }
}

// Cargar tabla cuando cargue el script
cargarTablaListas();

const listaListas = document.querySelectorAll(".editarListaUtil");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/lista-utiles", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    const listaListas = document.querySelectorAll(".editarListaUtil");

    listaListas.forEach(select => {
      select.innerHTML = ""; // Limpiar opciones

      data.forEach(lista => {
        const opcion = document.createElement("option");
        opcion.value = lista._id;
        // Cambia 'util' por la propiedad que corresponda en tu objeto
        opcion.textContent = lista.util || lista.nombre || "Sin nombre";
        select.appendChild(opcion);
      });
    });

  } catch (error) {
    console.error("Error al cargar listas:", error);
    // Aquí podrías mostrar alerta
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const crearUtil = document.getElementById("crearUtilForm");

  const inputNombreUtil = document.getElementById("nombreUtil");
  const inputDescripcionUtil = document.getElementById("descripcionUtil");
  const inputCantidadUtil = document.getElementById("cantidadUtil");
  const selectListasUtil = document.getElementById("listaUtil");

  async function registrarUtil() {
    // Si el select permite múltiples selecciones
    const listasSeleccionadas = selectListasUtil.multiple
      ? Array.from(selectListasUtil.selectedOptions).map(option => option.value)
      : [selectListasUtil.value.trim()];

    const datosRegistroUtil = {
      nombre: inputNombreUtil.value.trim(),
      descripcion: inputDescripcionUtil.value.trim(),
      cantidad: inputCantidadUtil.value.trim(),
      lista: listasSeleccionadas
    };

    try {
      const response = await fetch("http://localhost:3000/lista-utiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosRegistroUtil)
      });

      if (!response.ok) {
        if (response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Útil duplicado",
            text: "El correo o nombre de usuario ya existe en la base de datos.",
            showClass: { popup: "animate__animated animate__shakeX" },
            hideClass: { popup: "animate__animated animate__fadeOutUp" }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "Ocurrió un error al registrar el usuario.",
            showClass: { popup: "animate__animated animate__shakeX" },
            hideClass: { popup: "animate__animated animate__fadeOutUp" }
          });
        }
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

      cargarTablaListas();

      // Limpiar campos y errores
      inputNombreUtil.value = "";
      inputDescripcionUtil.value = "";
      inputCantidadUtil.value = "";
      selectListasUtil.value = "";

      inputNombreUtil.classList.remove("is-invalid");
      inputDescripcionUtil.classList.remove("is-invalid");
      inputCantidadUtil.classList.remove("is-invalid");
      selectListasUtil.classList.remove("is-invalid");

      // Cerrar modal correctamente
      const crearUtilModal = document.getElementById("crearUtilModal");
      const modalInstance =
        bootstrap.Modal.getInstance(crearUtilModal) || new bootstrap.Modal(crearUtilModal);
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

  if (crearUtil) {
    crearUtil.addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof validar === "function" ? validar() : true) {
        registrarUtil();
      }
    });
  }
});



// Función para asignar evento eliminar a botones de la tabla
function eliminarUtil() {
  document.querySelectorAll(".btnEliminarUtil").forEach(btn => {
    btn.addEventListener("click", async function() {
      const id = this.dataset.id;
      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró el id del usuario para eliminar',
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
        return;
      }

      const result = await Swal.fire({
        title: '¿Seguro que deseas eliminar este útil?',
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
          const res = await fetch(`http://localhost:3000/lista-utiles/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (!res.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.msj || 'Error al eliminar util',
              showClass: { popup: 'animate__animated animate__shakeX' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Útil eliminado',
            showConfirmButton: false,
            timer: 1500,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });

          // Recargar tabla
          cargarTablaListas();

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en el servidor al eliminar usuario',
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
        }
      }
    });
  });
}
