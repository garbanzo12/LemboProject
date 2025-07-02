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
  const selectId = document.querySelector('.cardright__selectid');

  const ids = await obtenerIdsCiclo();
  selectId.innerHTML = '';

  if (ids.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay Ciclos disponibles';
    option.disabled = true;
    selectId.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un ID';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectId.appendChild(defaultOption);

    ids.forEach(c => {
      const option = document.createElement('option');
      option.value = c._id;
      option.textContent = `${c.sensorId}`;
      selectId.appendChild(option);
    });
  }

  // Inicializar Choices.js después de llenar las opciones
  new Choices(selectId, {
    renderChoiceLimit: 5,
  });

  formBuscar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = selectId.value;

    if (!id) {
      alert('Por favor selecciona un ID');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/sensor/${id}`);
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
