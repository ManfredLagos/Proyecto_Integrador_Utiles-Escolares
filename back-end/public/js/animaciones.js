document.addEventListener("DOMContentLoaded", () => {
  const enlacesCarga = document.querySelectorAll("a.link-simular-carga");

  enlacesCarga.forEach(enlace => {
    enlace.addEventListener("click", function(event) {
      event.preventDefault(); // evitar navegación inmediata

      // Mostrar loader y sombra
      const loading = document.getElementById('loading');
      const shadow = document.getElementById('shadow');

      if (loading && shadow) {
        loading.style.display = 'block';
        shadow.style.display = 'block';
      }

      // Guardar href para redirigir luego
      const urlDestino = this.href;

      // Simular delay 2.5s antes de redirigir
      setTimeout(() => {
        // Redirigir a la URL del enlace
        window.location.href = urlDestino;

        // Opcional: ocultar loader y sombra (la página se recarga así que no será visible)
        if (loading && shadow) {
          loading.style.display = 'none';
          shadow.style.display = 'none';
        }
      }, 1000);
    });
  });
});
