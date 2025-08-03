document.addEventListener('DOMContentLoaded', () => {
  const tablaUsuarios = document.getElementById('tblUsuarios');
  const infoUsuarioInicio = document.getElementById('infoUsuarioInicio');

  // Ocultar tabla si está presente
  if (tablaUsuarios) tablaUsuarios.style.display = 'none';

  // Recuperar credenciales guardadas (por ejemplo, en localStorage)
  const storedUsuario = localStorage.getItem('usuarioLogin');
  const storedContrasenia = localStorage.getItem('contraseniaLogin');

  if (!storedUsuario || !storedContrasenia) {
    infoUsuarioInicio.innerHTML = '<p>No hay usuario logueado.</p>';
    return;
  }

  fetch('/iniciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: storedUsuario,
      contrasenia: storedContrasenia
    })
  })
    .then(response => {
      if (!response.ok) throw new Error('Usuario o contraseña incorrectos');
      return response.json();
    })
    .then(body => {
      const u = body.usuario;
      infoUsuarioInicio.innerHTML = `
        <h3>Bienvenido, ${u.nombre} ${u.apellidos}</h3>
        <p><strong>Correo:</strong> ${u.correo}</p>
        <p><strong>Usuario:</strong> ${u.usuario}</p>
        <p><strong>Rol:</strong> ${u.rol}</p>
        ${u.grado ? `<p><strong>Grado:</strong> ${u.grado}</p>` : ''}
      `;
    })
    .catch(error => {
      console.error('Error al cargar usuario:', error);
      infoUsuarioInicio.innerHTML = '<p>No se pudo obtener información del usuario.</p>';
    });
});
