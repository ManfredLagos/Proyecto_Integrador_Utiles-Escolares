const tablaUsuarios_mep = document.getElementById("tblUsuarios").querySelector("tbody"); 

async function cargarTabla() {
    try {
        const response = await fetch("http://localhost:3000/usuario_mep", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const listaUsuarios_mep = await response.json();
        const tablaUsuarios_mep = document.getElementById("tablaUsuarios_mep"); // Asegúrese de tener este ID
        tablaUsuarios_mep.innerHTML = ""; // Limpiar tabla antes de cargar

        listaUsuarios_mep.forEach(usuario_mep => {

            const infoGrado = Array.isArray(usuario_mep.grado)
              ? usuario_mep.grado.map(g => g.nombre).join(", ")
              : "";

            // Extraer nombres de estados
            const infoEstado = Array.isArray(usuario_mep.estado)
              ? usuario_mep.estado.map(e => e.nombre).join(", ")
              : "";

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${usuario_mep.nombre}</td>
                <td>${usuario_mep.apellidos}</td>
                <td>${usuario_mep.correo}</td>
                <td>${usuario_mep.usuario}</td>
                <td>${usuario_mep.rol}</td>
                <td class="text-center">${infoGrado}</td>
                <td class="text-center">${infoEstado}</td>
                <td class="text-center">
                    <button class="btnEditar" data-_id="${usuario_mep._id}">Editar</button>
                </td>
                <td class="text-center">
                    <button class="btnEliminarUsuario" data-_id="${usuario_mep._id}">Eliminar</button>
                </td>
            `;

            tablaUsuarios_mep.appendChild(fila);

            agregarEventosEliminar();
        });

        // Agregar eventos a los botones "Editar"
        document.querySelectorAll(".btnEditar").forEach(btn => {
            btn.addEventListener("click", async function () {
                const id = this.dataset._id;

                const usuario = await fetch(`http://localhost:3000/usuario_mep/${id}`)
                    .then(res => res.json());

                // Rellenar los campos del formulario con los datos del usuario
                document.getElementById("editarIdUsuario").value = usuario._id;
                document.getElementById("editarNombre").value = usuario.nombre;
                document.getElementById("editarApellidos").value = usuario.apellidos;
                document.getElementById("editarCorreo").value = usuario.correo;
                document.getElementById("editarUsuario").value = usuario.usuario;
                document.getElementById("editarRol").value = usuario.rol;
                    // Asignar valores al select Grado
                const selectGrado = document.getElementById("editarGrado");
                if (usuario.grado && Array.isArray(usuario.grado)) {
                  const valoresGrado = usuario.grado.map(g => g._id || g);
                  for (let option of selectGrado.options) {
                    option.selected = valoresGrado.includes(option.value);
                  }
                } else {
                  selectGrado.value = "";
                }

                // Asignar valores al select Estado
                const selectEstado = document.getElementById("editarEstado");
                if (usuario.estado && Array.isArray(usuario.estado)) {
                  const valoresEstado = usuario.estado.map(e => e._id || e);
                  for (let option of selectEstado.options) {
                    option.selected = valoresEstado.includes(option.value);
                  }
                } else {
                  selectEstado.value = "";
                }
                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById("editarUsuarioModal"));
                modal.show();

                async function actualizarUsuario() {

                  const id = document.getElementById("editarIdUsuario").value;
                  const nombre = document.getElementById("editarNombre").value.trim();
                  const apellidos = document.getElementById("editarApellidos").value.trim();
                  const correo = document.getElementById("editarCorreo").value.trim();
                  const usuario = document.getElementById("editarUsuario").value.trim();
                  const rol = document.getElementById("editarRol").value.trim();

                  // Para los selects de grado y estado, si son múltiples:
                  const selectGrado = document.getElementById("editarGrado");
                  const selectEstado = document.getElementById("editarEstado");

                  
                  // Obtener array de valores seleccionados (IDs)
                  const gradosSeleccionados = Array.from(selectGrado.selectedOptions).map(option => option.value);
                  const estadosSeleccionados = Array.from(selectEstado.selectedOptions).map(option => option.value);

                  // Armar objeto con datos a enviar
                  const datosActualizados = {
                    nombre,
                    apellidos,
                    correo,
                    usuario,
                    rol,
                    grado: gradosSeleccionados,
                    estado: estadosSeleccionados
                  };

                  try {
                    const response = await fetch(`http://localhost:3000/usuario_mep/${id}`, {
                      method: "PUT",  // o "PATCH" según tu API
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(datosActualizados)
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.msj || "Error al actualizar usuario");
                    }

                    Swal.fire({
                      icon: "success",
                      title: "Usuario actualizado",
                      timer: 1500,
                      showConfirmButton: false,
                      showClass: { popup: 'animate__animated animate__fadeInDown' },
                      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                    });

                    // Cerrar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById("editarUsuarioModal"));
                    modal.hide();

                    // Recargar tabla para mostrar los cambios
                    cargarTabla();

                  } catch (error) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: error.message || "Error al actualizar usuario",
                      showClass: { popup: 'animate__animated animate__shakeX' },
                      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                    });
                  }
                }

                const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");
                if (btnGuardarEdicion) {
                  btnGuardarEdicion.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Aquí podrías llamar validaciones si tienes
                    actualizarUsuario();
                  });
                }
            });
        });

    } catch (error) {
        console.error("Error al cargar la tabla:", error);
    }
}

cargarTabla();

// Función para asignar evento eliminar a botones de la tabla
function agregarEventosEliminar() {
  document.querySelectorAll(".btnEliminarUsuario").forEach(btn => {
    btn.addEventListener("click", async function() {
      const id = this.dataset._id;
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
        title: '¿Seguro que deseas eliminar este usuario?',
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
          const res = await fetch(`http://localhost:3000/usuario_mep/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (!res.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.msj || 'Error al eliminar usuario',
              showClass: { popup: 'animate__animated animate__shakeX' },
              hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            showConfirmButton: false,
            timer: 1500,
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });

          // Recargar tabla
          cargarTabla();

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

