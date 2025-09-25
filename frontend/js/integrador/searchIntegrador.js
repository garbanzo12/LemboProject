console.log('Script cargado');

async function obtenerIdsproducciones() {
  try {
    const res = await fetch('http://localhost:3000/api/production/searchproduction'); // ✅ Nuevo endpoint
    if (!res.ok) throw new Error('No se pudieron obtener los producciones');
    const data = await res.json();
    return data.producciones; // ✅ Ya viene como un array de IDs
  } catch (err) {
    console.error('Error al obtener los IDs:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cardright__form');
  const selectId = document.querySelector('.cardright__selectid');

  const ids = await obtenerIdsproducciones();
  selectId.innerHTML = '';

  if (ids.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay producciones disponibles';
    option.disabled = true;
    selectId.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un ID. ';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectId.appendChild(defaultOption);

    ids.forEach(productionId => {
      const option = document.createElement('option');
      option.value = productionId;
      option.textContent = `${productionId}`;
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
      const res = await fetch(`http://localhost:3000/api/production/getproductionbyId/${id}`);
      if (!res.ok) throw new Error('No se encontró el cultivo');
      const data = await res.json();

      localStorage.setItem('ProduccionSeleccionada', JSON.stringify(data));
      window.location.href = 'visualizarIntegrador.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar();
});
