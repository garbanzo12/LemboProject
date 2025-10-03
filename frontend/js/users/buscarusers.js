console.log('Script cargado');

async function obtenerInsumos() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/search', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!res.ok) throw new Error('No se pudieron obtener los usuarios');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error al obtener los usuarios:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cardright__form');
  const selectNombre = document.querySelector('.cardright__selectid');

  const usuarios = await obtenerInsumos();
  selectNombre.innerHTML = '';

  if (usuarios.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay usuarios disponibles';
    option.disabled = true;
    selectNombre.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un usuario';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectNombre.appendChild(defaultOption);

    usuarios.forEach(u => {
      const option = document.createElement('option');
      option.value = u.name_user;
      option.textContent = u.name_user;
      selectNombre.appendChild(option);
    });
  }

  new Choices(selectNombre, {
    renderChoiceLimit: 5,
  });

  formBuscar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = selectNombre.value;

    if (!nombre) {
      alert('Por favor selecciona un usuario');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/auth/search?nombre=${encodeURIComponent(nombre)}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!res.ok) throw new Error('No se encontró el usuario');
      const data = await res.json();
      console.log('Respuesta del backend al buscar usuario:', data); // <-- Depuración

      localStorage.setItem('usuarioSeleccionado', JSON.stringify(data));
      window.location.href = '3-view_user.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar();
});
