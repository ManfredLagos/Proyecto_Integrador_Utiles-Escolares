document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario modal administrador
  const formAdministrador = document.getElementById("loginForm");

  const inputNombreAdministrador = document.getElementById("registrarNombreAdministrador");
  const inputApellidosAdministrador = document.getElementById("registrarApellidosAdministrador");
  const inputCorreoAdministrador = document.getElementById("registrarCorreoAdministrador");
  const inputUsuarioAdministrador = document.getElementById("registrarUsuarioAdministrador");
  const inputContraseniaAdministrador = document.getElementById("registrarContraseniaAdministrador");
  const selectRolAdministrador = document.getElementById("registrarRolAdministrador");
  const selectGradoAdministrador = document.getElementById("registrarGradoAdministrador");
  const selectEstadoAdministrador = document.getElementById("registrarEstadoAdministrador");

  // Para feedback, usa los inputs con Bootstrap is-invalid y los div.invalid-feedback que ya tienes en HTML

  // Validación de campos vacíos y formatos
  function validarCamposVacios() {
    let error = false;

    // Nombre
    if (!inputNombreAdministrador.value.trim()) {
      inputNombreAdministrador.classList.add("is-invalid");
      error = true;
    } else {
      inputNombreAdministrador.classList.remove("is-invalid");
    }

    // Apellidos
    if (!inputApellidosAdministrador.value.trim()) {
      inputApellidosAdministrador.classList.add("is-invalid");
      error = true;
    } else {
      inputApellidosAdministrador.classList.remove("is-invalid");
    }

    // Correo
    if (!inputCorreoAdministrador.value.trim()) {
      inputCorreoAdministrador.classList.add("is-invalid");
      error = true;
    } else {
      inputCorreoAdministrador.classList.remove("is-invalid");
    }

    // Usuario
    if (!inputUsuarioAdministrador.value.trim()) {
      inputUsuarioAdministrador.classList.add("is-invalid");
      error = true;
    } else {
      inputUsuarioAdministrador.classList.remove("is-invalid");
    }

    // Contraseña
    if (!inputContraseniaAdministrador.value.trim()) {
      inputContraseniaAdministrador.classList.add("is-invalid");
      error = true;
    } else {
      inputContraseniaAdministrador.classList.remove("is-invalid");
    }

    // Rol
    if (!selectRolAdministrador.value) {
      selectRolAdministrador.classList.add("is-invalid");
      error = true;
    } else {
      selectRolAdministrador.classList.remove("is-invalid");
    }

    return error; // true si hay error
  }

  function esCorreoValido(correo) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  }

  function esDominioValidoParaDocente(correo) {
    const partes = correo.split("@");
    if (partes.length !== 2) return false;
    return partes[1].toLowerCase() === "mep.go.cr";
  }

  function validar() {
    if (validarCamposVacios()) {
      Swal.fire({
        icon: "warning",
        title: "No se puede registrar al usuario",
        text: "Por favor complete los campos resaltados.",
        showClass: { popup: 'animate__animated animate__headShake' },
        hideClass: { popup: 'animate__animated animate__fadeOut' }
      });
      return false;
    }

    const correoVal = inputCorreoAdministrador.value.trim();

    if (!esCorreoValido(correoVal)) {
      inputCorreoAdministrador.classList.add("is-invalid");
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingrese un correo electrónico válido.",
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
      return false;
    } else {
      inputCorreoAdministrador.classList.remove("is-invalid");
    }

    if (selectRolAdministrador.value === "docente") {
      if (!esDominioValidoParaDocente(correoVal)) {
        inputCorreoAdministrador.classList.add("is-invalid");
        Swal.fire({
          icon: "error",
          title: "Dominio inválido",
          text: "Para el rol de docente, el correo debe ser institucional (mep.go.cr).",
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
        return false;
      } else {
        inputCorreoAdministrador.classList.remove("is-invalid");
      }
    }

    return true;
  }

  async function registrarUsuario() {
    const datosRegistroUsuario_mep = {
      nombre: inputNombreAdministrador.value.trim(),
      apellidos: inputApellidosAdministrador.value.trim(),
      correo: inputCorreoAdministrador.value.trim(),
      usuario: inputUsuarioAdministrador.value.trim(),
      contrasenia: inputContraseniaAdministrador.value,
      rol: selectRolAdministrador.value.trim(),
      grado: [selectGradoAdministrador.value],
      estado: [selectEstadoAdministrador.value]
    };

    try {
      const response = await fetch("http://localhost:3000/usuario_mep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosRegistroUsuario_mep)
      });

      if (!response.ok) {
        if (response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Usuario duplicado",
            text: "El correo o nombre de usuario ya existe en la base de datos.",
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "Ocurrió un error al registrar el usuario.",
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
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
        showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
        hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' }
      });

      // Limpiar campos y errores
      inputNombreAdministrador.value = "";
      inputApellidosAdministrador.value = "";
      inputCorreoAdministrador.value = "";
      inputUsuarioAdministrador.value = "";
      inputContraseniaAdministrador.value = "";
      selectRolAdministrador.value = "";

      inputNombreAdministrador.classList.remove("is-invalid");
      inputApellidosAdministrador.classList.remove("is-invalid");
      inputCorreoAdministrador.classList.remove("is-invalid");
      inputUsuarioAdministrador.classList.remove("is-invalid");
      inputContraseniaAdministrador.classList.remove("is-invalid");
      selectRolAdministrador.classList.remove("is-invalid");

      // Cerrar modal usando Bootstrap 5 API
      const loginModalEl = document.getElementById('loginModal');
      const modalInstance = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
      modalInstance.hide();

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "No se pudo conectar con el servidor.",
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
    }
  }

  // Manejo del evento submit del formulario para prevenir envío natural
  if (formAdministrador) {
    formAdministrador.addEventListener("submit", (e) => {
      e.preventDefault();

      if (validar()) {
        registrarUsuario();
      }
    });
  }

});

// --------------------------------------

  // Botones cerrar y volver en el modal
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a inputs y select del formulario modal administrador
  const inputNombreAdministrador = document.getElementById("registrarNombreAdministrador");
  const inputApellidosAdministrador = document.getElementById("registrarApellidosAdministrador");
  const inputCorreoAdministrador = document.getElementById("registrarCorreoAdministrador");
  const inputUsuarioAdministrador = document.getElementById("registrarUsuarioAdministrador");
  const inputContraseniaAdministrador = document.getElementById("registrarContraseniaAdministrador");
  const selectRolAdministrador = document.getElementById("registrarRolAdministrador");

  // Botones cerrar y volver en el modal
  const btnCerrarModal = document.querySelector("#loginModal .btn-close");
  const btnVolverModal = document.querySelector("#loginModal .btn-secondary");

  const loginModalEl = document.getElementById('loginModal');

  // Función para limpiar campos y errores
  function limpiarFormularioRegistro() {
    inputNombreAdministrador.value = "";
    inputApellidosAdministrador.value = "";
    inputCorreoAdministrador.value = "";
    inputUsuarioAdministrador.value = "";
    inputContraseniaAdministrador.value = "";
    selectRolAdministrador.value = "";

    inputNombreAdministrador.classList.remove("is-invalid");
    inputApellidosAdministrador.classList.remove("is-invalid");
    inputCorreoAdministrador.classList.remove("is-invalid");
    inputUsuarioAdministrador.classList.remove("is-invalid");
    inputContraseniaAdministrador.classList.remove("is-invalid");
    selectRolAdministrador.classList.remove("is-invalid");
  }

  // Asignar evento a botón cerrar
  if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () => {
      limpiarFormularioRegistro();
    });
  }

  // Asignar evento a botón volver
  if (btnVolverModal) {
    btnVolverModal.addEventListener("click", () => {
      limpiarFormularioRegistro();
    });
  }

  if (loginModalEl) {
  loginModalEl.addEventListener('hidden.bs.modal', () => {
    limpiarFormularioRegistro();
  });
  }
});


const listaGrados = document.querySelectorAll(".editarGrado"); // NodeList
const listaEstados = document.querySelectorAll(".editarEstado");

async function mostrarGrados() {
  try {
    const response = await fetch("http://localhost:3000/grado", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();

    // Limpiar cada select con clase .editarGrado
    listaGrados.forEach(select => {
      select.innerHTML = "";  // Limpiar opciones previas

      data.forEach(grado => {
        const opcion = document.createElement("option");
        opcion.value = grado._id;
        opcion.textContent = grado.nombre;
        select.appendChild(opcion);
      });
    });

  } catch (error) {
    console.error("Error al cargar grados:", error);
  }
}


async function mostrarEstados() {
  try {
    const response = await fetch("http://localhost:3000/estado", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();

    listaEstados.forEach(select => {
      select.innerHTML = ""; // Limpiar opciones

      data.forEach(estado => {
        const opcion = document.createElement("option");
        opcion.value = estado._id;
        opcion.textContent = estado.nombre;
        select.appendChild(opcion);
      });
    });

  } catch (error) {
    console.error("Error al cargar estados:", error);
  }
}

mostrarGrados();
mostrarEstados();


document.addEventListener("DOMContentLoaded", () => {
  const btnOpciones = document.getElementById("opcionesConfiguracion");
  const listaConfiguracion = document.querySelector(".listaConfiguracion");

  // Inicialmente oculta con CSS o JS
  listaConfiguracion.style.visibility = "hidden";

  // Función para mostrar u ocultar la lista
  function toggleLista() {
    if (listaConfiguracion.style.visibility === "hidden") {
      listaConfiguracion.style.visibility = "visible";
    } else {
      listaConfiguracion.style.visibility = "hidden";
    }
  }

  // Cuando se hace click en el botón "Configuración"
  btnOpciones.addEventListener("click", (e) => {
    e.stopPropagation(); // evitar que el click se propague y oculte inmediatamente la lista
    toggleLista();
  });

  // Cuando se haga click fuera de la lista o del botón configuracion, ocultar la lista si está visible
  document.addEventListener("click", (e) => {
    // Si la lista está visible y el click no fue dentro del menú ni botón
    if (
      listaConfiguracion.style.visibility === "visible" &&
      !listaConfiguracion.contains(e.target) &&
      !btnOpciones.contains(e.target)
    ) {
      listaConfiguracion.style.visibility = "hidden";
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const usuarioId = localStorage.getItem('usuarioId');

  fetch(`http://localhost:3000/usuario_mep/informacionUsuario/${usuarioId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.usuario) {
        console.error("No se encontró usuario con ese id");
        return;
      }

      const usuario = data.usuario;

      const contenedorNombre = document.getElementById('cargarNombreUsuario');
      const contenedorInfo = document.getElementById('infoUsuario');

      if (contenedorNombre)
        contenedorNombre.innerHTML = `<h1>${usuario.nombre} ${usuario.apellidos}</h1>`;
        contenedorNombre.innerHTML +=`<h2>Administrador</h2>`;

      if (contenedorInfo) {
        contenedorInfo.innerHTML = `
          Nombre: ${usuario.nombre}<br><hr>
          Apellidos: ${usuario.apellidos}<br><hr>
          Correo: ${usuario.correo}<br><hr>
          Usuario: ${usuario.usuario}<br><hr>
          Rol: ${usuario.rol}<br><hr>
          ${Array.isArray(usuario.grado) ? 'Grado: ' + usuario.grado.map(g => g.nombre || g).join(', ') + '<br><hr>' : ''}
          ${Array.isArray(usuario.estado) ? 'Estado: ' + usuario.estado.map(e => e.nombre || e).join(', ') + '<br><hr>' : ''}
        `;
      }
    })
    .catch(error => {
      console.error('Error al obtener info usuario:', error);
      // Puedes agregar acción adicional, como logout o alerta
    });
});