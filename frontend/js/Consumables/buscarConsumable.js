console.log('Script cargado');

async function obtenerInsumos() {
  try {
    const res = await fetch('http://localhost:3000/api/consumable', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!res.ok) throw new Error('No se pudieron obtener los cultivos');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error al obtener los cultivos:', err.message);
    return [];
  }
}

async function inicializarBuscar() {
  const formBuscar = document.querySelector('.cardright__form');
  const selectNombre = document.querySelector('.cardright__selectid');

  const insumos = await obtenerInsumos();
  selectNombre.innerHTML = '';

  if (insumos.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No hay insumos disponibles';
    option.disabled = true;
    selectNombre.appendChild(option);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Selecciona un insumo';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectNombre.appendChild(defaultOption);

    insumos.forEach(i => {
      const option = document.createElement('option');
      option.value = i.name_consumables;
      option.textContent = i.name_consumables;
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
      alert('Por favor selecciona un insumo');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/consumable/search?nombre=${encodeURIComponent(nombre)}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!res.ok) throw new Error('No se encontró el insumo');
      const data = await res.json();

  localStorage.setItem('Insumoseleccionado', JSON.stringify(data));
  window.location.href = '3-view-insumes.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarBuscar();
});
