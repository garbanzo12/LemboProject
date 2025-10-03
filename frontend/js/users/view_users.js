console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('usuarioSeleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return

    const inputs = document.querySelectorAll('input'); // ⬅️ Selecciono todos los inputs y les asigno su valor correspondiente
   
    inputs[0].value = data.userId || '';
    inputs[1].value = data.type_user || '';
    inputs[2].value = data.type_ID || '';
    inputs[3].value = data.num_document_identity || '';
    inputs[4].value = data.name_user || '';
    inputs[5].value = data.email || '';
    inputs[6].value = data.cellphone || '';
    if (typeof data.state_user !== 'undefined') {
      inputs[7].checked = data.state_user === 'habilitado';
    }

  });

 