const tablaUsuarios_mep = document.getElementById("tblUsuarios").querySelector("tbody"); 

async function cargarTabla() {
    fetch("http://localhost:3000/usuario_mep", {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    }).then(response => response.json())
    .then(listaUsuarios_mep => {
        tablaUsuarios_mep.innerHTML = ""; //Instrucción que limpia la tabla
        listaUsuarios_mep.forEach(usuario_mep => {
            const fila = document.createElement("tr");
            fila.innerHTML= `
                <td> ${usuario_mep.nombre} </td>
                <td> ${usuario_mep.apellidos} </td>
                <td> ${usuario_mep.correo} </td>
                <td> ${usuario_mep.usuario} </td>
                <td> ${usuario_mep.rol} </td>
                <td class="text-center"> Activo </td>
                <td class="text-center"> <button class="btnEditar">Editar</button> </td>

            `;
            tablaUsuarios_mep.appendChild(fila); //Agregar la fila creada en la tabla
        })
    })
}

cargarTabla();
