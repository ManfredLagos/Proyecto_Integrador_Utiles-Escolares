const tablaUtiles = document.getElementById("tblUtiles").querySelector("tbody"); 

async function cargarTablaUtiles() {
    try {
        const response = await fetch("http://localhost:3000/utiles", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const listaUtiles = await response.json();
        const tablaUtiles = document.getElementById("tablaUtiles"); // Asegúrese de tener este ID
        tablaUtiles.innerHTML = ""; // Limpiar tabla antes de cargar

        listaUtiles.forEach(util => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${util.nombre}</td>
                <td>${util.descripcion}</td>
                <td>${util.cantidad}</td>
                <td class="text-center">N/A</td>
                <td class="text-center">
                    <button class="btnEditarUtil" data-_id="${util._id}">Editar</button>
                </td>
            `;

            tablaUtiles.appendChild(fila);
        });

        // Agregar eventos a los botones "Editar"
        document.querySelectorAll(".btnEditarUtil").forEach(btn => {
            btn.addEventListener("click", async function () {
                const id = this.dataset._id;

                const util = await fetch(`http://localhost:3000/utiles/${id}`)
                    .then(res => res.json());

                // Rellenar los campos del formulario con los datos del usuario
                document.getElementById("editarIdUtil").value = util._id;
                document.getElementById("editarNombreUtil").value = util.nombre;
                document.getElementById("editarDescripcionUtil").value = util.descripcion;
                document.getElementById("editarCantidadUtil").value = util.cantidad;
                document.getElementById("editarListaUtil").value = util.lista;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById("editarUtilModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar la tabla:", error);
    }
}

cargarTablaUtiles();