// Validación en dashboard.js
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');

document.querySelector('.side-main__menu-list--login-out').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/frontend/views/home/home.html';
});

if (!token) {
  // Si no hay token, redirige a login
  window.location.href = '/frontend/views/home/home.html';
} else {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decodifica el JWT
    const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

    if (payload.exp < now) {
      // Token expirado
      localStorage.removeItem('token');
      alert('Sesión expirada. Por favor, inicia sesión de nuevo.');
      window.location.href = '/frontend/views/home/home.html';
    } else {
      // ✅ El token es válido
      console.log('Usuario:', payload.name);
      console.log('Rol:', payload.role);

      // Puedes usar el rol para mostrar u ocultar cosas
      if (payload.role !== 'Administrador') {


        
        document.querySelector('.side-main__menu-list--crop--create').style.display = 'none';
        document.querySelector('.side-main__menu-list--crop--update').style.display = 'none';
        document.querySelector('.side-main__menu-list--cycle--create').style.display = 'none';
        document.querySelector('.side-main__menu-list--cycle--update').style.display = 'none';
        document.querySelector('.side-main__menu-list--sensor--create').style.display = 'none';
        document.querySelector('.side-main__menu-list--sensor--update').style.display = 'none';
        document.querySelector('.side-main__menu-list--consumable--create').style.display = 'none';
        document.querySelector('.side-main__menu-list--consumable--update').style.display = 'none';
        document.querySelector('.side-main__menu-list--user--create').style.display = 'none';
        document.querySelector('.side-main__menu-list--user--update').style.display = 'none';
        document.querySelector('.side-main__menu-list--user--search').style.display = 'none';
        document.querySelector('.side-main__menu-list--user--list').style.display = 'none';
        document.querySelector('.side-main__menu-list--user').style.display = 'none';
      
      }
      if(payload.role !== 'Personal de Apoyo' && payload.role !== 'Administrador') {
        document.querySelector('.Bar').style.display = 'none';
        document.querySelector('.side-main__menu-list--production').style.display = 'none';
        document.querySelector('.side-main__menu-list--production--create').style.display = 'none';
        document.querySelector('.side-main__menu-list--production--view').style.display = 'none';
        document.querySelector('.side-main__menu-list--crop').style.display = 'none';
        document.querySelector('.side-main__menu-list--crop--list').style.display = 'none';
        document.querySelector('.side-main__menu-list--crop--search').style.display = 'none';
        document.querySelector('.side-main__menu-list--cycle').style.display = 'none';
        document.querySelector('.side-main__menu-list--cycle--search').style.display = 'none';
        document.querySelector('.side-main__menu-list--cycle--list').style.display = 'none';
        document.querySelector('.side-main__menu-sensor').style.display = 'none';
        document.querySelector('.side-main__menu-list--sensor--search').style.display = 'none';
        document.querySelector('.side-main__menu-list--sensor--list').style.display = 'none';
        document.querySelector('.side-main__menu-cosumable').style.display = 'none';
        document.querySelector('.side-main__menu-list--consumable--search').style.display = 'none';
        document.querySelector('.side-main__menu-list--consumable--list').style.display = 'none';

      }
    }
  } catch (error) {
    // Si el token está corrupto
    localStorage.removeItem('token');
    //window.location.href = '/frontend/views/home/home.html';
  }
}
