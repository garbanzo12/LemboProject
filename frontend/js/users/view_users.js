console.log('holis')
  document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('usuarioSeleccionado')); // ⬅️ Obtengo los datos que me habia mandado buscar_crops.js con localStorage
    if (!data) return; // ⬅️ Si no hay data hago un return
    
  console.log(data);
  const inputs = document.querySelectorAll('.cardright__input-form'); // ⬅️ Selecciono todos los inputs correctos
  const checkbox = document.getElementById('toggle-color');
  if (inputs.length < 7) return;

  inputs[0].value = data.userId || '';
  inputs[1].value = data.type_user || '';
  inputs[2].value = data.type_ID || '';
  inputs[3].value = data.num_document_identity || '';
  inputs[4].value = data.name_user || '';
  inputs[5].value = data.email || '';
  inputs[6].value = data.cellphone || '';
  if (checkbox) checkbox.checked = data.state_user === 'habilitado';

  });

 