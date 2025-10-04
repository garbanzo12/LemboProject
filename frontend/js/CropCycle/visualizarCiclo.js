console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('cicloseleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return

    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
    const formatDate = (isoDate) => {
        return new Date(isoDate).toISOString().split('T')[0];
      };
    inputs[0].value = data.cycleId || '';           // ⬅️ ID del cultivo
    inputs[1].value = data.name_cycle || '';         // ⬅️ Nombre del cultivo
    inputs[2].value = data.description_cycle || '';         // ⬅️ Tipo de cultivo
    inputs[3].value = formatDate(data.cycle_start) || '';     // ⬅️ Ubicación
    inputs[4].value = formatDate(data.cycle_end)  || '';  //⬅️  Descripción
    inputs[5].value = data.news_cycle || '';   
    inputs[6].value = data.state_cycle || '';          // ⬅️ Estado

  });

 