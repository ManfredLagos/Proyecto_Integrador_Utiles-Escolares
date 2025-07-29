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
