console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('Cicloseleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return

    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
    const formatDate = (isoDate) => {
        return new Date(isoDate).toISOString().split('T')[0];
      };
    inputs[0].value = data.id || '';           // ⬅️ ID del cultivo
    inputs[1].value = data.name_cropCycle || '';         // ⬅️ Nombre del cultivo
    inputs[2].value = data.description_cycle || '';         // ⬅️ Tipo de cultivo
    inputs[3].value = formatDate(data.period_cycle_start) || '';     // ⬅️ Ubicación
    inputs[4].value = formatDate(data.period_cycle_end)  || '';  //⬅️  Descripción
    inputs[5].value = data.news_cycle || '';   
    inputs[6].value = data.state_cycle || '';          // ⬅️ Estado

  });

 