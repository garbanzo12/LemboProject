console.log('holis')
document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('Insumoseleccionado'));
  if (!data) return;

  const inputs = document.querySelectorAll('input');
  // Order:
  // 0: Id Insumo
  // 1: Tipo de Insumo
  // 2: Nombre del Insumo
  // 3: Cantidad
  // 4: Unidad de Medida
  // 5: Valor Unitario
  // 6: Valor Total
  // 7: Descripción
  // 8: Habilitado/Deshabilitado (checkbox)
  inputs[0].value = data.consumableId || '';
  inputs[1].value = data.type_consumables || '';
  inputs[2].value = data.name_consumables || '';
  inputs[3].value = data.quantity_consumables || '';
  inputs[4].value = data.unit_consumables || '';
  inputs[5].value = data.unitary_value || '';
  inputs[6].value = data.total_value || '';
  inputs[7].value = data.description_consumables || '';
  if (typeof data.state_cycle !== 'undefined') {
    inputs[8].checked = Boolean(data.state_cycle);
  }

});

