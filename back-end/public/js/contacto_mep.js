const nombreContacto = document.getElementById("nombreContacto");
const correoContacto = document.getElementById("correoContacto");
const asuntoContacto = document.getElementById("asuntoContacto");
const mensageContacto = document.getElementById("mensageContacto");
const btnEnviar = document.querySelector(".btnFormularioContacto");

// Función para validar campos vacíos generales
function validarCamposVaciosContacto() {
  let error = false;
  // Lista de inputs y textarea obligatorios
  const inputs = [nombreContacto, correoContacto, asuntoContacto, mensageContacto];

  inputs.forEach(input => {
    if (input.value.trim() === "") {
      input.classList.add("input-error");
      error = true;
    } else {
      input.classList.remove("input-error");
    }
  });

  return !error;
}

function esCorreoValido(correo) {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo);
}

function validarFormulario() {
  if (!validarCamposVaciosContacto()) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos requeridos correctamente.",
      showClass: { popup: 'animate__animated animate__headShake' },
      hideClass: { popup: 'animate__animated animate__fadeOut' }
    });
    return false;
  }

  if (!esCorreoValido(correoContacto.value.trim())) {
    Swal.fire({
      icon: "error",
      title: "Correo inválido",
      text: "Por favor, ingrese un correo electrónico válido.",
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
    correoContacto.classList.add("input-error");
    correoContacto.focus();
    return false;
  } else {
    correoContacto.classList.remove("input-error");
  }

  return true;
}


btnEnviar.addEventListener("click", function(e) {
  e.preventDefault();

  if (validarFormulario()) {
    Swal.fire({
      icon: "success",
      title: "Mensaje enviado",
      text: "Gracias por contactarnos. Nos comunicaremos contigo pronto.",
      timer: 3000,
      showConfirmButton: false,
      showClass: { popup: 'animate__animated animate__fadeInUp' },
      hideClass: { popup: 'animate__animated animate__fadeOutDown' }
    });

    nombreContacto.value = "";
    correoContacto.value = "";
    asuntoContacto.value = "";
    mensageContacto.value = "";
  }
});
