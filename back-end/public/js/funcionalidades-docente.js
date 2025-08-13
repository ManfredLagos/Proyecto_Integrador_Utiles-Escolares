document.addEventListener('DOMContentLoaded', () => {
  const usuarioId = localStorage.getItem('docenteId');

  fetch(`http://localhost:3000/usuario_mep/informacionDocente/${usuarioId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.usuario) {
        console.error("No se encontró usuario con ese id");
        return;
      }

      const docente = data.usuario;

      const contenedorNombreDocente = document.getElementById('cargarNombreDocente');
      const contenedorInfoDocente = document.getElementById('infoDocente');

      if (contenedorNombreDocente)
        contenedorNombreDocente.innerHTML = `<h1>${docente.nombre} ${docente.apellidos}</h1>`;
        contenedorNombreDocente.innerHTML +=`<h2>Docente</h2>`;

      if (contenedorInfoDocente) {
        contenedorInfoDocente.innerHTML = `
          Nombre: ${docente.nombre}<br><hr>
          Apellidos: ${docente.apellidos}<br><hr>
          Correo: ${docente.correo}<br><hr>
          Usuario: ${docente.usuario}<br><hr>
          Rol: ${docente.rol}<br><hr>
          ${Array.isArray(docente.grado) ? 'Grado: ' + docente.grado.map(g => g.nombre || g).join(', ') + '<br><hr>' : ''}
        `;
      }
    })
    .catch(error => {
      console.error('Error al obtener info usuario:', error);
      // Puedes agregar acción adicional, como logout o alerta
    });
});