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
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${usuario_mep.nombre}</td>
                <td>${usuario_mep.correo}</td>
                <td>${usuario_mep.usuario}</td>
                <td>${usuario_mep.rol}</td>
                <td class="text-center">N/A</td>
                <td class="text-center">Activo</td>
                <td class="text-center">
                    <button class="btnEditar" data-_id="${usuario_mep._id}">Editar</button>
                </td>
            `;

            tablaUsuarios_mep.appendChild(fila);
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
                document.getElementById("editarCorreo").value = usuario.correo;
                document.getElementById("editarUsuario").value = usuario.usuario;
                document.getElementById("editarRol").value = usuario.rol;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById("editarUsuarioModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar la tabla:", error);
    }
}

cargarTabla();



document.getElementById("btnEliminarUsuario").addEventListener("click", async () => {
  const id = document.getElementById("editarIdUsuario").value;

  if (!id) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró el usuario para eliminar',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
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

      // Cierra modal y recarga tabla
      bootstrap.Modal.getInstance(document.getElementById("editarUsuarioModal")).hide();
      cargarTabla();

    } catch (err) {
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


