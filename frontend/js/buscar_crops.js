console.log('Script cargado');

async function obtenerIdsCultivos() { // ⬅️ Hacemos una funcion obtenerIdsCultivos
  try {
    const res = await fetch('http://localhost:5501/crops'); // ⬅️ Nos ocnectamos con la bd por medio de un fetch
    if (!res.ok) throw new Error('No se pudieron obtener los cultivos');// ⬅️ Mensaje de error si no se puede conectar
    const data = await res.json(); // ⬅️ Mandamos la informacion en JSON 
    return data.map(cultivo => cultivo.id); // ⬅️ Tomamos la propiedad ID de cada cultivo
  } catch (err) {
    console.error('Error al obtener los IDs:', err.message);// ⬅️ Mensaje de error 
    return [];
  }
}

async function inicializarBuscar() {// ⬅️ Hacemos una funcion inicializarBuscar
  const formBuscar = document.querySelector('.cicloRight__form'); // ⬅️ Tomamaos del DOM al form
  const selectId = document.querySelector('.selectId');// ⬅️ Tomamaos del DOM al select

  
  const ids = await obtenerIdsCultivos(); // ⬅️ Llenamos el <select> con los IDs disponibles
  selectId.innerHTML = ''; // ⬅️ Limpiamos las opciones anteriores

  if (ids.length === 0) { // ⬅️ En caso de que no existan IDS
    const option = document.createElement('option');
    option.textContent = 'No hay cultivos disponibles';
    option.disabled = true;
    selectId.appendChild(option);
  } else {
    const defaultOption = document.createElement('option'); // ⬅️ Creamos un option para contener cada ID
    defaultOption.textContent = 'Selecciona un ID';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectId.appendChild(defaultOption);

    ids.forEach(id => { // ⬅️ por medio de un forEach traemos los IDS de la bd y los mostramos en el DOM
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `ID: ${id}`;
      selectId.appendChild(option);
    });
  }

  
  formBuscar.addEventListener('submit', async (e) => {// ⬅️ Nos encargamos de Manejar el evento de envío del formulario
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

setTimeout(() => {
  inicializarBuscar();
}, 100);
