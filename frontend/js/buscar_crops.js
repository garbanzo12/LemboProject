console.log('Script cargado');

async function obtenerIdsCultivos() {
  try {
    const res = await fetch('http://localhost:5501/crops');
    if (!res.ok) throw new Error('No se pudieron obtener los cultivos');
    const data = await res.json();
    return data.cultivos.map(cultivo => cultivo.id);
  } catch (err) {
    console.error('Error al obtener los IDs:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cicloRight__form');
  const selectId = document.querySelector('.selectId');

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
      option.textContent = `ID: ${id}`;
      selectId.appendChild(option);
    });
  }

  // ✅ Inicializar Choices después de llenar las opciones
  new Choices(selectId, {
    renderChoiceLimit: 5,  // Limita cuántos se ven en pantalla
  });

  formBuscar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = selectId.value;

    if (!id) {
      alert('Por favor selecciona un ID');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5501/crops/${id}`);
      if (!res.ok) throw new Error('No se encontró el cultivo');
      const data = await res.json();

      localStorage.setItem('cultivoSeleccionado', JSON.stringify(data));
      window.location.href = '3-visualizar-cultivo.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar(); // 👈 Ya no necesitas el setTimeout
});
