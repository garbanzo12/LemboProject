console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('Insumoseleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return

    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
    const formatDate = (isoDate) => {
        return new Date(isoDate).toISOString().split('T')[0];
      };
    inputs[0].value = data.id || '';           // ⬅️ ID del cultivo
    inputs[1].value = data.type_consumables || '';         // ⬅️ Nombre del cultivo
    inputs[2].value = data.name_consumables || '';         // ⬅️ Tipo de cultivo
    inputs[3].value = (data.quantity_consumables) || '';     // ⬅️ Ubicación
    inputs[4].value = (data.unit_consumables)  || '';  //⬅️  Descripción
    inputs[5].value = data.unitary_value || '';  
    inputs[6].value = data.total_value || '';  
    inputs[7].value = data.description_consumables || '';
    inputs[8].value = data.state_cycle || '';          // ⬅️ Estado

  });

 