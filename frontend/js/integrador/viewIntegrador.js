  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('ProduccionSeleccionada')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return
console.log(data)
    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
    const formatDate = (isoDate) => {
        return new Date(isoDate).toISOString().split('T')[0];
      };
    inputs[0].value = data.productionId || '';           // ⬅️ ID del cultivo
    inputs[1].value = data.name_production || '';         // ⬅️ Nombre del cultivo

    inputs[2].value = data.responsable || '';         // ⬅️ Tipo de cultivo

    inputs[3].value = (data.users_selected) || '';     // ⬅️ Ubicación
    inputs[4].value = (data.crops_selected)  || '';  //⬅️  Descripción
    inputs[5].value = data.cropCycles || '';   
    inputs[6].value = data.consumables || '';   
    inputs[7].value = data.quantity_consumables || '';   
    inputs[8].value = data.total_value_consumables || '';   
    inputs[9].value = data.name_sensor || '';   
    inputs[10].value = data.total_value_consumables || '';   

  });

 