const tablaUtilesBody = document.querySelector("#tablaUtiles tbody"); 
// O si #tablaUtiles es el <tbody> directamente:
// const tablaUtilesBody = document.getElementById("tablaUtiles");

async function cargarTablaUtiles() {
  try {
    const response = await fetch("http://localhost:3000/utiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Error al cargar útiles');

    const listaUtiles = await response.json();

    // Limpiar tabla antes de cargar
    tablaUtilesBody.innerHTML = "";

    listaUtiles.forEach(util => {

      const infoUtil = Array.isArray(util.lista)
        ? util.lista.map(g => g.nombre).join(", ")
        : "";

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${util.nombre}</td>
        <td>${util.descripcion}</td>
        <td>${util.cantidad}</td>
        <td class="text-center">${infoUtil}</td>
        <td class="text-center">
          <button class="btnEditarUtil btn btn-sm btn-primary" data-id="${util._id}">Editar</button>
        </td>
        <td class="text-center">
          <button class="btnEliminarUtil btn btn-sm btn-danger" data-id="${util._id}">Eliminar</button>
        </td>
      `;

      tablaUtilesBody.appendChild(fila);

      eliminarUtil();
    });

    // Agregar eventos a los botones "Editar"
    // Para evitar múltiples bindings, removemos listeners previos
    document.querySelectorAll(".btnEditarUtil").forEach(btn => {
      btn.removeEventListener("click", editarUtilHandler);
      btn.addEventListener("click", editarUtilHandler);
    });

    // Agregar eventos a botones "Eliminar" si quieres
    // document.querySelectorAll(".btnEliminarUtil").forEach(btn => {
    //   btn.removeEventListener("click", eliminarUtilHandler);
    //   btn.addEventListener("click", eliminarUtilHandler);
    // });


  } catch (error) {
    console.error("Error al cargar la tabla:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cargar los útiles.',
    });
  }
}

// Handler para click en botón editar
async function editarUtilHandler(event) {
  const id = this.dataset.id;

  try {
    const response = await fetch(`http://localhost:3000/utiles/${id}`);
    if (!response.ok) throw new Error('Error al obtener datos del útil');

    const util = await response.json();

    // Rellenar los campos del formulario con los datos del útil
    document.getElementById("editarIdUtil").value = util._id;
    document.getElementById("editarNombreUtil").value = util.nombre || '';
    document.getElementById("editarDescripcionUtil").value = util.descripcion || '';
    document.getElementById("editarCantidadUtil").value = util.cantidad != null ? util.cantidad : '';

    // Asignar valores al select Lista
    const selectLista = document.getElementById("editarListaUtil");
    if (util.lista && Array.isArray(util.lista)) {
      const valoresLista = util.lista.map(g => g._id || g);
      for (let option of selectLista.options) {
        option.selected = valoresLista.includes(option.value);
      }
    } else {
      // Limpiar selección
      Array.from(selectLista.options).forEach(opt => opt.selected = false);
    }

    // Mostrar el modal
    const modalElement = document.getElementById("editarUtilModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Preparar listener para botón Guardar solo una vez
    const btnGuardarEdicionUtil = document.getElementById("btnGuardarEdicionUtil");
    if (btnGuardarEdicionUtil) {
      // Eliminar cualquier listener anterior para evitar multiples ejecuciones
      btnGuardarEdicionUtil.replaceWith(btnGuardarEdicionUtil.cloneNode(true));
      const nuevoBtn = document.getElementById("btnGuardarEdicionUtil");

      nuevoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        actualizarUtil(modal);
      });
    }

  } catch (error) {
    console.error("Error al obtener datos del útil:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo obtener la información del útil.'
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
    const response = await fetch(`http://localhost:3000/utiles/${id}`, {
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
    cargarTablaUtiles();

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
cargarTablaUtiles();

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
      const response = await fetch("http://localhost:3000/utiles", {
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

      cargarTablaUtiles();

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
          const res = await fetch(`http://localhost:3000/utiles/${id}`, { method: "DELETE" });
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
          cargarTablaUtiles();

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
