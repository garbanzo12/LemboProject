console.log('hola')
const form = document.querySelector('.cardright__form--top3');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('.cardright__input-form--email').value.trim();
  const password = document.querySelector('.cardright__input-form--password').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || 'Error desconocido');

    // Guardar token en localStorage
    // Decodificar JWT si necesitas ver los datos
    const payload = JSON.parse(atob(result.token.split('.')[1]));
    console.log("Rol:", payload.role); // Puedes usar esto para controlar accesos

    // Redireccionar o mostrar interfaz
    mostrarMensaje(form, "✅ Login exitoso", "green");
    localStorage.setItem('token', result.token);
    localStorage.setItem('rol', payload.role);  // Opcional, si lo necesitas rápido
    setTimeout(() => {
      window.location.href = '/frontend/views/index_main.html';
    }, 50);    
  } catch (error) {
    mostrarMensaje(form, "❌ " + error.message, "red");
  }


  function mostrarMensaje(form, mensaje, color) {
    let mensajeSpan = form.querySelector(".cardright__foot-form");
    
    if (!mensajeSpan) {
        mensajeSpan = document.createElement("span");
        mensajeSpan.classList.add("cardright__foot-form");
        mensajeSpan.style.display = "block";
        mensajeSpan.style.marginTop = "10px";
        mensajeSpan.style.fontWeight = "bold";
        form.appendChild(mensajeSpan);
    }

    mensajeSpan.textContent = mensaje;
    mensajeSpan.style.color = color;
}
});
