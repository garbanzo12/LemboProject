console.log('Script cargado');

async function obtenerIdsCultivos() {
  try {
    const res = await fetch('http://localhost:5501/crops/id'); // ✅ Nuevo endpoint
    if (!res.ok) throw new Error('No se pudieron obtener los cultivos');
    const data = await res.json();
    return data.cultivos; // ✅ Ya viene como un array de IDs
  } catch (err) {
    console.error('Error al obtener los IDs:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cardright__form');
  const selectId = document.querySelector('.cardright__selectid');

  const ids = await obtenerIdsCultivos();
  selectId.innerHTML = '';

  if (ids.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay cultivos disponibles';
    option.disabled = true;
    selectId.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un ID';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectId.appendChild(defaultOption);

    ids.forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${id}`;
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
      const res = await fetch(`http://localhost:5501/api/crops/${id}`);
      if (!res.ok) throw new Error('No se encontró el cultivo');
      const data = await res.json();

      localStorage.setItem('cultivoSeleccionado', JSON.stringify(data));
      window.location.href = '3-view_crops.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar();
});
