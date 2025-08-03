
  const contenedorIniciar = document.querySelector(".contenedorIniciar");
  const enlaceRegistrar = document.getElementById("enlaceRegistrar");
  const btnVolverInicio = document.getElementById("btnVolverInicio");

  // Inputs por clase y atributo name específicos dentro del formulario registro
  const inputNombre = document.querySelector('input.nombre[name="nombre"]');
  const inputApellidos = document.querySelector('input.apellidos[name="apellidos"]');
  const inputCorreo = document.querySelector('input.correo[name="correo"]');
  const inputUsuario = document.querySelector('input.usuario[name="usuario"]');
  const inputContrasenia = document.querySelector('input.contrasenia[name="contrasenia"]');
  const selectRol = document.querySelector('select.rol[name="rol"]');
  const btnGuardar = document.getElementById("btnRegistrarusuario");

  // Inputs requeridos dentro del formulario de registro
  const inputsRequeridos = document.querySelectorAll('.registrarUsuario input[required], .registrarUsuario select[required]');

  // Evento para abrir el formulario de registro
  enlaceRegistrar.addEventListener("click", () => {
    contenedorIniciar.classList.add("toggle");
  });

  // Evento para volver a la vista inicial
  btnVolverInicio.addEventListener("click", () => {
    contenedorIniciar.classList.remove("toggle");
  });

  // Función para validar campos vacíos
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

    return error;
  }

  // Función para validar formato general de correo
  function esCorreoValido(correo) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  }

  // Función para validar dominio institucional para rol docente
  function esDominioValidoParaDocente(correo) {
    const partes = correo.split("@");
    if (partes.length !== 2) return false;
    return partes[1].toLowerCase() === "ucenfotec.ac.cr";
  }

  // Función principal para validar antes de registrar
  function validar() {
    if (validarCamposVacios()) {
      Swal.fire({
        icon: "warning",
        title: "No se puede registrar al usuario",
        text: "Por favor complete los campos resaltados.",
        showClass: { popup: 'animate__animated animate__headShake' },
        hideClass: { popup: 'animate__animated animate__fadeOut' }
      });
      return;
    }

    // Validar formato del correo
    if (!esCorreoValido(inputCorreo.value.trim())) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingrese un correo electrónico válido.",
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
      inputCorreo.classList.add("input-error");
      return;
    } else {
      inputCorreo.classList.remove("input-error");
    }

    // Validar dominio para rol docente
    if (selectRol.value === "docente") {
      if (!esDominioValidoParaDocente(inputCorreo.value.trim())) {
        Swal.fire({
          icon: "error",
          title: "Dominio inválido",
          text: "Para el rol de docente, el correo debe ser institucional (ucenfotec.ac.cr).",
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
        inputCorreo.classList.add("input-error");
        return;
      } else {
        inputCorreo.classList.remove("input-error");
      }
    }

    // Si todo está bien, registra usuario
    registrarUsuario();
  }

  // Función para enviar datos al backend y manejar respuesta
  function registrarUsuario() {
    const datosUsuario_mep = {
      nombre: inputNombre.value.trim(),
      apellidos: inputApellidos.value.trim(),
      correo: inputCorreo.value.trim(),
      usuario: inputUsuario.value.trim(),
      contrasenia: inputContrasenia.value,
      rol: selectRol.value.trim()
    };

    fetch("http://localhost:3000/usuario_mep", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

  // Asociar evento al botón Registrar con prevención del submit por defecto
  btnGuardar.addEventListener("click", function(e) {
    e.preventDefault();
    validar();
  });


  //******************************Inicio de sesión**********************************//

  // Referencias a elementos del DOM con variables en español
const usuarioIniciar = document.getElementById('inputUsuarioIniciar');
const contraseniaIniciar = document.getElementById('inputContraseniaIniciar');
const contenedorUsuario = document.getElementsByClassName("contenedorUsuario");
const contenedorContrasenia = document.getElementsByClassName("contenedorContrasenia");
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

  // Usar el primer elemento de cada colección
  if (usuarioIniciar.value.trim() === '') {
    contenedorUsuario[0].classList.add('input-error');
    error = true;
  } else {
    contenedorUsuario[0].classList.remove('input-error');
  }

  if (contraseniaIniciar.value.trim() === '') {
    contenedorContrasenia[0].classList.add('input-error');
    error = true;
  } else {
    contenedorContrasenia[0].classList.remove('input-error');
  }

  return !error;
}
// Función para iniciar sesión
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
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status !== 200) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: body.message || 'Usuario o contraseña incorrectos.',
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
      } else {
          switch(body.usuario.rol) {
            case 'administrador':
              window.location.href = '/administrador-dashboard';
              break;
            case 'docente':
              window.location.href = '/docente-dashboard';
              break;
            case 'padre':
              window.location.href = '/padre-dashboard';
              break;
            default:
              window.location.href = '/';
              break;
          }
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

