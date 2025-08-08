// Selectores para formulario registro dentro del contenedor
const inputNombreAdministrador = document.getElementById("registrarNombreAdministrador");
const inputApellidosAdministrador = document.getElementById("registrarApellidosAdministrador");
const inputCorreoAdministrador = document.getElementById("registrarCorreoAdministrador");
const inputUsuarioAdministrador = document.getElementById("registrarUsuarioAdministrador");
const inputContraseniaAdministrador = document.getElementById("registrarContraseniaAdministrador");
const selectRolAdministrador = document.getElementById("registrarRolAdministrador");
const btnGuardarAdministrador = document.getElementById("btnRegistrarUsuarioAdministrador");

// Inputs requeridos dentro del formulario de registro para validar
const inputsRequeridosAdministrador = document.querySelectorAll('input[required], select[required]');


// --------- Funciones de validación --------------

function validarCamposVacios() {

    let error = false;

    inputsRequeridosAdministrador.forEach(input => {
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
  return partes[1].toLowerCase() === "ucenfotec.ac.cr";
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

  if (!esCorreoValido(inputCorreoAdministrador.value.trim())) {
    Swal.fire({
      icon: "error",
      title: "Correo inválido",
      text: "Por favor ingrese un correo electrónico válido.",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
    inputCorreoAdministrador.classList.add("input-error");
    return false;
  } else {
    inputCorreoAdministrador.classList.remove("input-error");
  }

  if (selectRolAdministrador.value === "docente") {
    if (!esDominioValidoParaDocente(inputCorreoAdministrador.value.trim())) {
      Swal.fire({
        icon: "error",
        title: "Dominio inválido",
        text: "Para el rol de docente, el correo debe ser institucional (ucenfotec.ac.cr).",
        showClass: { popup: 'animate__animated animate__shakeX' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });
      inputCorreoAdministrador.classList.add("input-error");
      return false;
    } else {
      inputCorreoAdministrador.classList.remove("input-error");
    }
  }

  return true;
}

// --------- Función para registrar usuario -----------

function registrarUsuario() {
  const datosRegistroUsuario_mep = {
    nombre: inputNombreAdministrador.value.trim(),
    apellidos: inputApellidosAdministrador.value.trim(),
    correo: inputCorreoAdministrador.value.trim(),
    usuario: inputUsuarioAdministrador.value.trim(),
    contrasenia: inputContraseniaAdministrador.value,
    rol: selectRolAdministrador.value.trim()
  };

  fetch("http://localhost:3000/usuario_mep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosRegistroUsuario_mep)
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
      inputNombreAdministrador.value = "";
      inputApellidosAdministrador.value = "";
      inputCorreoAdministrador.value = "";
      inputUsuarioAdministrador.value = "";
      inputContrasenia.value = "";
      selectRolAdministrador.value = "padre";

      // Eliminar clases de error
      inputsRequeridos.forEach(input => input.classList.remove("input-error"));
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
if (btnGuardarAdministrador) {
  btnGuardarAdministrador.addEventListener("click", function(e) {
    e.preventDefault();
    if (validar()) {
      registrarUsuario();
    }
  });
} 