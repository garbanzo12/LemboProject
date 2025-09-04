if (!sessionStorage.getItem("yaRecargue")) {
  sessionStorage.setItem("yaRecargue", "true");
  location.reload(); // solo recarga una vez
}
(function () {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/frontend/views/home/home.html';
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const ahora = Math.floor(Date.now() / 1000);

    if (payload.exp < ahora) {
      localStorage.removeItem('token');
      window.location.href = '/frontend/views/home/home.html';
      return;
    }


    // ✅ Usuario autenticado y con rol administrador
    console.log('👑 Acceso administrador:', payload.name);

  } catch (error) {
    console.error('Token corrupto:', error);
    localStorage.removeItem('token');
    window.location.href = '/frontend/views/home/home.html';
  }
})();
