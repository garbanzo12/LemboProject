console.log('Script cargado');

async function obtenerCultivos() {
  try {
    const res = await fetch('http://localhost:3000/api/crops', {
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
  const selectId = document.querySelector('.cardright__selectid');

  const cultivos = await obtenerCultivos();
  selectId.innerHTML = '';

  if (cultivos.length === 0) {
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

    cultivos.forEach(c => {
      const option = document.createElement('option');
      option.value = c._id; // se usa _id como valor
      option.textContent = `${c.cropId}`; // o lo que quieras mostrar
      selectId.appendChild(option);
    });
  }

  new Choices(selectId, {
    renderChoiceLimit: 5,
  });

  formBuscar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = selectId.value;

    if (!id) {
      alert('Por favor selecciona un cultivo');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/crops/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

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
