// --------- Variables DOM para registro y control vista ---------
const contenedorIniciar = document.querySelector(".contenedorIniciar");
const enlaceRegistrar = document.getElementById("enlaceRegistrar");
const btnVolverInicio = document.getElementById("btnVolverInicio");

// Selectores para formulario registro dentro del contenedor
const inputNombre = document.getElementById("nombre");
const inputApellidos = document.getElementById("apellidos");
const inputCorreo = document.getElementById("correo");
const inputUsuario = document.getElementById("usuario");
const inputContrasenia = document.getElementById("contrasenia");
const selectRol = document.getElementById("rol");
const btnGuardar = document.getElementById("btnRegistrarUsuario");
const idGradoNA = "6886a19bddfc296d582e321a";
const idEstadoNA = "689642464dc2172ab1aeb774";
const idHijoNA = "68979d2c7482715e059fb4f5";

// Inputs requeridos dentro del formulario de registro para validar
const inputsRequeridos = document.querySelectorAll('input[required], select[required]');


// ------------ Eventos para mostrar/ocultar formulario registro -----------

if (enlaceRegistrar) {
  enlaceRegistrar.addEventListener("click", () => {
    contenedorIniciar.classList.add("toggle");

    // Esperar 3 segundos para remover la clase input-error solo en los contenedores
    setTimeout(() => {
      if (contenedorUsuario) contenedorUsuario.classList.remove('input-error');
      if (contenedorContrasenia) contenedorContrasenia.classList.remove('input-error');
    }, 1000);
  });
}


if (btnVolverInicio) {
  btnVolverInicio.addEventListener("click", () => {
    // Remueve la clase toggle inmediatamente
    contenedorIniciar.classList.remove("toggle");

    // Esperar 3 segundos para remover la clase input-error
    setTimeout(() => {
      inputsRequeridos.forEach(input => {
        input.classList.remove("input-error");
      });
    }, 1000);
  });
}


// --------- Funciones de validación --------------

function validarCamposVacios() {
  let error = false;

  inputsRequeridos.forEach(input => {
    if (input.value.trim() === "") {
      input.classList.add("input-error");
      error = true;
    } else {
      input.classList.remove("input-error");
    }
  });

  return error; // true si hay error (campos vacíos)
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

  if (!esCorreoValido(inputCorreo.value.trim())) {
    Swal.fire({
      icon: "error",
      title: "Correo inválido",
      text: "Por favor ingrese un correo electrónico válido.",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
    inputCorreo.classList.add("input-error");
    return false;
  } else {
    inputCorreo.classList.remove("input-error");
  }

  if (selectRol.value === "docente") {
    if (!esDominioValidoParaDocente(inputCorreo.value.trim())) {
      Swal.fire({
        icon: "error",
        title: "Dominio inválido",
        text: "Para el rol de docente, el correo debe ser institucional (@mep.go.cr).",
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
      inputCorreo.classList.add("input-error");
      return false;
    } else {
      inputCorreo.classList.remove("input-error");
    }
  }

  return true;
}

// --------- Función para registrar usuario -----------

function registrarUsuario() {
  const datosUsuario_mep = {
    nombre: inputNombre.value.trim(),
    apellidos: inputApellidos.value.trim(),
    correo: inputCorreo.value.trim(),
    usuario: inputUsuario.value.trim(),
    contrasenia: inputContrasenia.value,
    rol: selectRol.value.trim(),
    grado: [idGradoNA],
    estado: [idEstadoNA],
    hijo: [idHijoNA]
  };

  fetch("http://localhost:3000/usuario_mep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosUsuario_mep)
  })
  .then(response => {
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
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "¡Registro realizado exitosamente!",
        showConfirmButton: false,
        timer: 2000,
        showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
        hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' }
      });

      // Limpiar campos
      inputNombre.value = "";
      inputApellidos.value = "";
      inputCorreo.value = "";
      inputUsuario.value = "";
      inputContrasenia.value = "";
      selectRol.value = "padre";

      // Eliminar clases de error
      inputsRequeridos.forEach(input => input.classList.remove("input-error"));

      // Cerrar formulario registro
      contenedorIniciar.classList.remove("toggle");
    }
  })
  .catch(error => {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error de red",
      text: "No se pudo conectar con el servidor.",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  });
}

// Evento para botón Registrar con prevención comportamiento por defecto
if (btnGuardar) {
  btnGuardar.addEventListener("click", function(e) {
    e.preventDefault();
    if (validar()) {
      registrarUsuario();
    }
  });
}

  //******************************Inicio de sesión**********************************//


  // Referencias a elementos del DOM con variables en español
const usuarioIniciar = document.getElementById('inputUsuarioIniciar');
const contraseniaIniciar = document.getElementById('inputContraseniaIniciar');
const contenedorUsuario = document.querySelector(".contenedorUsuario");
const contenedorContrasenia = document.querySelector(".contenedorContrasenia");
const btnIniciar = document.getElementById('btnIniciar');
const imgOcultarContrasenia = document.getElementById('imgOcultarContrasenia');
const imgMostrarContrasenia= document.getElementById('imgMostrarContrasenia');


function mostrarContrasenia() {
    if (contraseniaIniciar.type === "password") {
        contraseniaIniciar.type = "text";
        imgMostrarContrasenia.style.visibility = 'hidden';
        imgMostrarContrasenia.style.opacity = '0';
        imgOcultarContrasenia.style.visibility = 'visible';
        imgOcultarContrasenia.style.opacity = '1';


    }
}

function ocultarContrasenia() {
    if (contraseniaIniciar.type === "text"){
        contraseniaIniciar.type = "password";
        imgMostrarContrasenia.style.visibility = 'visible';
        imgMostrarContrasenia.style.opacity = '1';
        imgOcultarContrasenia.style.visibility = 'hidden';
        imgOcultarContrasenia.style.opacity = '0';
    }
}

function validarCamposInicioSesion() {
  let error = false;

  if (usuarioIniciar.value.trim() === '') {
    if (contenedorUsuario) contenedorUsuario.classList.add('input-error');
    error = true;
  } else {
    if (contenedorUsuario) contenedorUsuario.classList.remove('input-error');
  }

  if (contraseniaIniciar.value.trim() === '') {
    if (contenedorContrasenia) contenedorContrasenia.classList.add('input-error');
    error = true;
  } else {
    if (contenedorContrasenia) contenedorContrasenia.classList.remove('input-error');
  }

  return !error;
}

// ID del estado "inactivo"
const ID_INACTIVO = "689642604dc2172ab1aeb776";

function iniciarSesion() {
  if (!validarCamposInicioSesion()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor complete todos los campos.',
      showClass: { popup: 'animate__animated animate__headShake' },
      hideClass: { popup: 'animate__animated animate__fadeOut' }
    });
    return;
  }

  const datosInicioSesion = {
    usuario: usuarioIniciar.value.trim(),
    contrasenia: contraseniaIniciar.value.trim()
  };

  fetch('http://localhost:3000/usuario_mep/iniciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosInicioSesion)
  })
  .then(response =>
    response.json().then(data => ({
      status: response.status,
      body: data
    }))
  )
  .then(({ status, body }) => {
    if (status !== 200) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: body.message || 'Usuario o contraseña incorrectos.',
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
      return;
    }

    const estados = Array.isArray(body.usuario.estado) ? body.usuario.estado : [];

    const tieneEstadoInactivo = estados.some(e =>
      (e._id && e._id.toString() === ID_INACTIVO) ||
      (e.nombre && e.nombre.toLowerCase() === 'inactivo')
    );

    if (tieneEstadoInactivo) {
      Swal.fire({
        icon: 'error',
        title: 'Cuenta Inactiva',
        html: 'Su cuenta está inactiva. Por favor, comuníquese al correo <a href="/contacto">soporte@mep.go.cr</a> para asistencia.',
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
      return;
    }

    

    // Redirigir según rol
    switch (body.usuario.rol) {
      case 'administrador':
        // Guardar solo el ID del usuario en localStorage
        localStorage.setItem('usuarioId', body.usuario.id);
        window.location.href = '/administrador-dashboard';
        break;
      case 'docente':
        // Guardar solo el ID del usuario en localStorage
        localStorage.setItem('docenteId', body.usuario.id);
        window.location.href = '/docente-dashboard';
        break;
      case 'padre':
        // Guardar solo el ID del usuario en localStorage
        localStorage.setItem('padreId', body.usuario.id);
        window.location.href = '/padre-dashboard';
        break;
      default:
        window.location.href = '/';
        break;
    }

  })
  .catch(error => {
    console.error('Error en login:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  });
}

// Listener para el botón de iniciar sesión
btnIniciar.addEventListener('click', (e) => {
  e.preventDefault();
  iniciarSesion();
});


document.addEventListener("DOMContentLoaded", () => {
  const enlacesCarga = document.querySelectorAll("button.link-simular-carga");

  enlacesCarga.forEach(enlace => {
    enlace.addEventListener("click", function(event) {
      event.preventDefault(); // evitar navegación inmediata

      // Mostrar loader y sombra
      const loading = document.getElementById('loading');
      const shadow = document.getElementById('shadow');

      if (loading && shadow) {
        loading.style.display = 'block';
        shadow.style.display = 'block';
      }

      // Guardar href para redirigir luego
      const urlDestino = this.href;

      // Simular delay 2.5s antes de redirigir
      setTimeout(() => {
        // Redirigir a la URL del enlace
        window.location.href = urlDestino;

        // Opcional: ocultar loader y sombra (la página se recarga así que no será visible)
        if (loading && shadow) {
          loading.style.display = 'none';
          shadow.style.display = 'none';
        }
      }, 2000);
    });
  });
});

