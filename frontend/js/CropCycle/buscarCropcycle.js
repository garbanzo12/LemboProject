console.log('Script cargado');

async function obtenerCiclos() {
  try {
    const res = await fetch('http://localhost:3000/api/cycle', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!res.ok) throw new Error('No se pudieron obtener los ciclos');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error al obtener los ciclos:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cardright__form');
  const selectNombre = document.querySelector('.cardright__selectid');

  const ciclos = await obtenerCiclos();
  selectNombre.innerHTML = '';

  if (ciclos.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay ciclos disponibles';
    option.disabled = true;
    selectNombre.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un ciclo';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectNombre.appendChild(defaultOption);

    ciclos.forEach(c => {
      const option = document.createElement('option');
      option.value = c.name_cycle;
      option.textContent = c.name_cycle;
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
      alert('Por favor selecciona un ciclo');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/cycle/search?nombre=${encodeURIComponent(nombre)}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!res.ok) throw new Error('No se encontró el ciclo');
      const data = await res.json();

      localStorage.setItem('cicloseleccionado', JSON.stringify(data));
      window.location.href = '3- view_cycle_crops.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar();
});
