
  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn("⚠️ No hay token. Usuario no autenticado.");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const nombre = payload.name || payload.name_user || 'Usuario';
      const rol = payload.role || 'Sin rol';

      document.querySelector('.side-main__name').textContent = nombre;
      document.querySelector('.side-main__roll').textContent = rol;

    } catch (error) {
      console.error('❌ Error al decodificar el token:', error.message);
    }
  });