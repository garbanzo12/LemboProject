console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('cultivoSeleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return

    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
    
    inputs[0].value = data.id || '';           // ⬅️ ID del cultivo
    inputs[1].value = data.name_crop || '';         // ⬅️ Nombre del cultivo
    inputs[2].value = data.type_crop || '';         // ⬅️ Tipo de cultivo
    inputs[3].value = data.location || '';     // ⬅️ Ubicación
    inputs[4].value = data.description_crop || '';  //⬅️  Descripción
    inputs[5].value = data.size_m2 || '';         // ⬅️ Tamaño m2
    inputs[6].value = data.image_crop || '';         // ⬅️ Imagen

  
    document.querySelector('cardright__label-form--color').checked = data.status_crop === 'habilitado'; // ⬅️ esto es para el habilitado
  });

