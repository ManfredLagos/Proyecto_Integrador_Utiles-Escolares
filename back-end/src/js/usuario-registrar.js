const inputNombre = document.getElementById("txtNombre");
const inputApellidos = document.getElementById("txtApellidos");
const inputCorreo = document.getElementById("txtCorreo");
const inputUsuario = document.getElementById("txtUsuario");
const inputContrasenia = document.getElementById("txtContrasenia");
const btnGuardar = document.getElementById("btnGuardar");

const inputsRequeridos = document.querySelectorAll("input[required]");

// Validar todos los campos vacíos
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

// Función principal de validación
function validar() {
  if (!validarCamposVacios()) {
    registrarUsuario();
  } else {
    Swal.fire({
      icon: "warning",
      title: "No se puede registrar al usuario",
      text: "Por favor complete los campos resaltados."
    });
  }
}

// Función para registrar el usuario
function registrarUsuario() {
  const datosUsuario_mep = {
    nombre: inputNombre.value.trim(),
    apellidos: inputApellidos.value.trim(),
    correo: inputCorreo.value.trim(),
    usuario: inputUsuario.value.trim(),
    contrasenia: inputContrasenia.value,
    rol: "padre"
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
        if (response.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Usuario duplicado",
            text: "El correo o nombre de usuario ya existe en la base de datos."
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "Ocurrió un error al registrar el usuario."
          });
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Registro realizado exitosamente!",
          showConfirmButton: false,
          timer: 2000,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });

        // Limpiar campos
        inputNombre.value = "";
        inputApellidos.value = "";
        inputCorreo.value = "";
        inputUsuario.value = "";
        inputContrasenia.value = "";

        // Eliminar clases de error
        inputsRequeridos.forEach(input => input.classList.remove("input-error"));
      }
    })
    .catch(error => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "No se pudo conectar con el servidor."
      });
    });
}

btnGuardar.addEventListener("click", validar);
