document.addEventListener('DOMContentLoaded', () => {
  const usuarioId = localStorage.getItem('padreId');

  fetch(`http://localhost:3000/usuario_mep/informacionPadre/${usuarioId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.usuario) {
        console.error("No se encontró usuario con ese id");
        return;
      }

      const usuarioPadre = data.usuario;

      const contenedorNombrePadre = document.getElementById('cargarNombrePadre');
      const contenedorInfoPadre = document.getElementById('infoPadre');

      if (contenedorNombrePadre)
        contenedorNombrePadre.innerHTML = `<h1>${usuarioPadre.nombre} ${usuarioPadre.apellidos}</h1>`;
        contenedorNombrePadre.innerHTML +=`<h2>Padre</h2>`;

      if (contenedorInfoPadre) {
        contenedorInfoPadre.innerHTML = `
          Nombre: ${usuarioPadre.nombre}<br><hr>
          Apellidos: ${usuarioPadre.apellidos}<br><hr>
          Correo: ${usuarioPadre.correo}<br><hr>
          Usuario: ${usuarioPadre.usuario}<br><hr>
          Rol: ${usuarioPadre.rol}<br><hr>
        `;
      }
    })
    .catch(error => {
      console.error('Error al obtener info usuario:', error);
      // Puedes agregar acción adicional, como logout o alerta
    });
});
