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
  const selectNombre = document.querySelector('.cardright__selectid');

  const producciones = await obtenerIdsproducciones();
  selectNombre.innerHTML = '';

  if (producciones.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay producciones disponibles';
    option.disabled = true;
    selectNombre.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona una producción';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectNombre.appendChild(defaultOption);

    producciones.forEach(p => {
      const option = document.createElement('option');
      option.value = p.name_production;
      option.textContent = p.name_production;
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
      alert('Por favor selecciona una producción');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/production/searchproduction?nombre=${encodeURIComponent(nombre)}`);
      if (!res.ok) throw new Error('No se encontró la producción');
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
