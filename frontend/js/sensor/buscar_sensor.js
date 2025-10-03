console.log('Script cargado');

async function obtenerIdsCiclo() {
  try {
  const res = await fetch('http://localhost:3000/api/sensor', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });   
    if (!res.ok) throw new Error('No se pudieron obtener los Ciclos');
    const data = await res.json();
    return data; // ✅ Ya viene como un array de IDs
  } catch (err) {
    console.error('Error al obtener los IDs:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cardright__form');
  const selectNombre = document.querySelector('.cardright__selectid');

  const sensores = await obtenerIdsCiclo();
  selectNombre.innerHTML = '';

  if (sensores.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay sensores disponibles';
    option.disabled = true;
    selectNombre.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un sensor';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectNombre.appendChild(defaultOption);

    sensores.forEach(s => {
      const option = document.createElement('option');
      option.value = s.name_sensor;
      option.textContent = s.name_sensor;
      selectNombre.appendChild(option);
    });
  }

  // Inicializar Choices.js después de llenar las opciones
  new Choices(selectNombre, {
    renderChoiceLimit: 5,
  });

  formBuscar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = selectNombre.value;

    if (!nombre) {
      alert('Por favor selecciona un sensor');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/sensor/search?nombre=${encodeURIComponent(nombre)}`);
      if (!res.ok) throw new Error('No se encontró el sensor');
      const data = await res.json();

      localStorage.setItem('SensorSeleccionado', JSON.stringify(data));
      window.location.href = '3-view_sensor.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar();
});
