const tablaListasBody = document.querySelector("#tablaListas tbody"); 
// O si #tablaListas es el <tbody> directamente:
// const tablaListasBody = document.getElementById("tablaListas");

async function cargarTablaListas() {

  const usuarioId = localStorage.getItem('docenteId');

  try {
    const response = await fetch(`http://localhost:3000/lista-utiles/docente/${usuarioId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Error al cargar Encontar usuario');

    const usuarioLista = await response.json();

    // Limpiar tabla antes de cargar
    tablaListasBody.innerHTML = "";

    usuarioLista.forEach(lista => {

      const gradoLista = Array.isArray(lista.grado)
      ? lista.grado.map(g => g.nombre).join(", ")
      : "";

      const utilLista = Array.isArray(lista.utiles)
      ? lista.utiles.map(g => g.nombre).join(", ")
      : "";

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${lista.nombre}</td>
        <td>${lista.descripcion}</td>
        <td class="text-center">${utilLista}</td>
        <td class="text-center">${gradoLista}</td>
        <td class="text-center">
          <button class="btnEditar btnEditarLista btn btn-sm btn-primary" data-id="${lista._id}">Editar</button>
        </td>
        <td class="text-center">
          <button class="btnEliminarUsuario btnEliminarLista btn btn-sm btn-danger" data-id="${lista._id}">Eliminar</button>
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
    /*Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cargar las listas.',
    });*/
  }
}

// Handler para click en botón editar
async function editarListaHandler(event) {
  const id = this.dataset.id;

  try {
    const response = await fetch(`http://localhost:3000/lista-utiles/${id}`);
    if (!response.ok) throw new Error('Error al obtener datos de la lista');

    const lista = await response.json();

    // Rellenar los campos del formulario con los datos de la lista
    document.getElementById("editarIdLista").value = lista._id;
    document.getElementById("editarNombreLista").value = lista.nombre || '';
    document.getElementById("editarDescripcionLista").value = lista.descripcion || '';

    // Asignar valores al select Lista
    const selectGrados = document.getElementById("editarGradoLista");
    if (lista.grado && Array.isArray(lista.grado)) {
      const valoresGrados = lista.grado.map(g => g._id || g);
      for (let option of selectGrados .options) {
        option.selected = valoresGrados.includes(option.value);
      }
    } else {
      // Limpiar selección
      Array.from(selectGrados.options).forEach(opt => opt.selected = false);
    }

    const contenedorUtilesCheckbox = document.querySelectorAll(".contenedorUtiles");

    if (lista.utiles && Array.isArray(lista.utiles)) {
      const valoresUtiles = lista.utiles.map(u => u._id || u);

      contenedorUtilesCheckbox.forEach(contenedor => {
        const checkboxes = contenedor.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = valoresUtiles.includes(checkbox.value);
        });
      });
    } else {
      contenedorUtilesCheckbox.forEach(contenedor => {
        const checkboxes = contenedor.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
      });
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

//Función para actualizar la lista
async function actualizarUtil(modalInstance) {
  const id = document.getElementById("editarIdLista").value;
  const nombre = document.getElementById("editarNombreLista").value.trim();
  const descripcion = document.getElementById("editarDescripcionLista").value.trim();
  const gradoLista = document.getElementById("editarGradoLista");
  const idDocente = localStorage.getItem('docenteId');

  const gradosSeleccionadosLista = Array.from(gradoLista.selectedOptions).map(opt => opt.value);

  const contenedoresUtiles = document.querySelectorAll(".contenedorUtiles");
  let utilesSeleccionados = [];

  contenedoresUtiles.forEach(contenedor => {
    const checkboxes = contenedor.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
      if (!utilesSeleccionados.includes(checkbox.value)) {
        utilesSeleccionados.push(checkbox.value);
      }
    });
  });

  if (!id) {
    await Swal.fire({ icon: 'error', title: 'Error', text: 'ID de la lista no es válido.' });
    return;
  }

  if (!nombre) {
    await Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'El nombre es obligatorio.' });
    return;
  }

  if (gradosSeleccionadosLista.length === 0) {
    await Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Debe seleccionar al menos un grado.' });
    return;
  }

  if (utilesSeleccionados.length === 0) {
    await Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Debe seleccionar al menos un útil.' });
    return;
  }

  const datosActualizadosLista = {
    nombre,
    descripcion,
    idDocente,
    utiles: utilesSeleccionados,
    grado: gradosSeleccionadosLista
  };

  try {
    const response = await fetch(`http://localhost:3000/lista-utiles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosActualizadosLista)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ msj: 'Error desconocido' }));
      throw new Error(errorData.msj || "Error al actualizar lista");
    }

    await Swal.fire({
      icon: "success",
      title: "Lista actualizada",
      timer: 1500,
      showConfirmButton: false,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    if (modalInstance) {
      modalInstance.hide();
    } else {
      const modal = bootstrap.Modal.getInstance(document.getElementById("editarListaModal")); // verificar id aquí
      if (modal) modal.hide();
    }

    cargarTablaListas();

  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || "Error al actualizar lista",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }
}



// Cargar tabla cuando cargue el script
cargarTablaListas();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/grado", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    const listaGrados = document.querySelectorAll(".editarListaGrado");

    listaGrados.forEach(select => {
      select.innerHTML = ""; // Limpiar opciones

      data.forEach(grado => {
        const opcion = document.createElement("option");
        opcion.value = grado._id;
        opcion.textContent = grado.util || grado.nombre || "Sin nombre";
        select.appendChild(opcion);
      });
    });

  } catch (error) {
    console.error("Error al cargar lista grados:", error);
    // Aquí podrías mostrar alerta
  }
});

// Función para crear listas de útiles escolares
document.addEventListener("DOMContentLoaded", () => {
  const crearLista = document.getElementById("crearListaForm");

  const inputNombreLista = document.getElementById("nombreLista");
  const inputDescripcionLista = document.getElementById("descripcionLista");
  const idDocente = localStorage.getItem('docenteId');
  const selectListasGrado = document.getElementById("crearGradoLista");

  async function registrarLista() {
    const gradosSeleccionados = selectListasGrado.multiple
      ? Array.from(selectListasGrado.selectedOptions).map(option => option.value)
      : [selectListasGrado.value.trim()];

    const contenedoresUtiles = document.querySelectorAll(".contenedorUtiles");
    let utilesSeleccionados = [];

    contenedoresUtiles.forEach(contenedor => {
      const checkboxes = contenedor.querySelectorAll('input[type="checkbox"]:checked');
      checkboxes.forEach(checkbox => {
        if (!utilesSeleccionados.includes(checkbox.value)) {
          utilesSeleccionados.push(checkbox.value);
        }
      });
    });

    const datosRegistroLista = {
      nombre: inputNombreLista.value.trim(),
      descripcion: inputDescripcionLista.value.trim(),
      idDocente: idDocente,
      utiles: utilesSeleccionados,
      grado: gradosSeleccionados
    };

    try {
      const response = await fetch("http://localhost:3000/lista-utiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosRegistroLista)
      });

      if (!response.ok) {
        if (response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Lista duplicada",
            text: "El nombre ya existe en la base de datos.",
            showClass: { popup: "animate__animated animate__shakeX" },
            hideClass: { popup: "animate__animated animate__fadeOutUp" }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "Ocurrió un error al registrar la lista.",
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

      // Limpiar campos
      inputNombreLista.value = "";
      inputDescripcionLista.value = "";
      selectListasGrado.value = "";

      inputNombreLista.classList.remove("is-invalid");
      inputDescripcionLista.classList.remove("is-invalid");
      selectListasGrado.classList.remove("is-invalid");

      // Cerrar modal
      const crearListaModal = document.getElementById("listaModal");
      const modalInstance = bootstrap.Modal.getInstance(crearListaModal) || new bootstrap.Modal(crearListaModal);
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

  if (crearLista) {
    crearLista.addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof validar === "function" ? validar() : true) {
        registrarLista();
      }
    });
  }
});


// Función para asignar evento eliminar a botones de la tabla
function eliminarLista() {
  document.querySelectorAll(".btnEliminarLista").forEach(btn => {
    btn.addEventListener("click", async function() {
      const id = this.dataset.id;
      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró el id de la lista a eliminar',
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
        return;
      }

      const result = await Swal.fire({
        title: '¿Seguro que deseas eliminar esta lista?',
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
              text: data.msj || 'Error al eliminar lista',
              showClass: { popup: 'animate__animated animate__shakeX' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Lista eliminada',
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
            text: 'Error en el servidor al eliminar lista',
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
        }
      }
    });
  });
}


async function mostrarUtilesCheckbox() {
  try {
    const response = await fetch("http://localhost:3000/utiles", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Error al obtener los útiles");

    const utiles = await response.json();

    // Obtener todos los contenedores con la clase .contenedorUtiles
    const contenedoresUtiles = document.querySelectorAll(".contenedorUtiles");

    // Recorrer cada contenedor para llenarlo con los checkboxes
    contenedoresUtiles.forEach(contenedor => {
      contenedor.innerHTML = "";  // Limpiar contenido anterior

      utiles.forEach(util => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "util_" + util._id;
        checkbox.value = util._id;
        checkbox.name = "utilesSeleccionados"; // Si quieres que se agrupen

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = util.nombre;

        const wrapper = document.createElement("div");
        wrapper.classList.add("form-check");

        checkbox.classList.add("form-check-input");
        label.classList.add("form-check-label");

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        contenedor.appendChild(wrapper);
      });
    });
  } catch (error) {
    console.error("Error al cargar útiles:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarUtilesCheckbox();
});


const contenedorListas = document.getElementById('contenedorListasUtiles'); // Div contenedor donde pondremos todas las tablas
// IMPORTANTE: En tu HTML debes tener <div id="contenedorListasUtiles"></div>

async function cargarListasPorDocente() {

  try {
    const response = await fetch(`http://localhost:3000/lista-utiles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error('Error al cargar las listas del docente');

    const listas = await response.json();

    // Limpiar contenedor antes de agregar tablas
    contenedorListas.innerHTML = '';

    listas.forEach(lista => {
      // Crear título de la lista
      const titulo = document.createElement('h4');
      titulo.textContent = `Lista: ${lista.nombre || 'Sin nombre'}`;
      contenedorListas.appendChild(titulo);

      // Crear tabla
      const tabla = document.createElement('table');
      tabla.classList.add('table', 'table-bordered', 'mb-4');

      // Crear encabezado de la tabla
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      ['Nombre', 'Descripción', 'Cantidad'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        th.classList.add('text-center');
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      tabla.appendChild(thead);

      // Crear cuerpo de la tabla
      const tbody = document.createElement('tbody');

      if (Array.isArray(lista.utiles) && lista.utiles.length > 0) {
        lista.utiles.forEach(util => {
          const tr = document.createElement('tr');

          const tdNombre = document.createElement('td');
          tdNombre.textContent = util.nombre || '-';

          const tdDescripcion = document.createElement('td');
          tdDescripcion.textContent = util.descripcion || '-';

          const tdCantidad = document.createElement('td');
          tdCantidad.textContent = (util.cantidad !== undefined) ? util.cantidad : '-';
          tdCantidad.classList.add('text-center');

          tr.appendChild(tdNombre);
          tr.appendChild(tdDescripcion);
          tr.appendChild(tdCantidad);

          tbody.appendChild(tr);
        });
      } else {
        // Si no hay útiles, mostrar fila indicando vacío
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '3');
        td.classList.add('text-center');
        td.textContent = 'No hay útiles para esta lista.';
        tr.appendChild(td);
        tbody.appendChild(tr);
      }

      tabla.appendChild(tbody);
      contenedorListas.appendChild(tabla);
    });

    // Aquí podrías agregar botones u otras funcionalidades si quieres
    // Elimina las funciones eliminarLista() o editarListaHandler() si no aplican a este código
  } catch (error) {
    console.error("Error al cargar las listas:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cargar las listas.'
    });
  }
}

document.addEventListener('DOMContentLoaded', cargarListasPorDocente);
