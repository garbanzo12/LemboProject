console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('usuarioSeleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return

    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
   
    inputs[0].value = data.userId || '';           // ⬅️ ID del cultivo
    inputs[1].value = data.type_user || '';         // ⬅️ Nombre del cultivo
    inputs[2].value = data.type_ID || '';         // ⬅️ Tipo de cultivo
    inputs[3].value = (data.num_document_identity) || '';     // ⬅️ Ubicación
    inputs[4].value = (data.name_user)  || '';  //⬅️  Descripción
    inputs[5].value = (data.email)  || '';  
    inputs[6].value = data.cellphone || '';  
    inputs[7].value = data.state_cycle || '';          // ⬅️ Estado

  });

 