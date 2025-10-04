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
  inputs[4].value = (data.crops_selected) || '';  //⬅️  Descripción
  inputs[5].value = data.cropCycles || '';
  inputs[6].value = data.consumables || '';
  inputs[7].value = data.quantity_consumables || '';
  inputs[8].value = data.total_value_consumables || '';
  inputs[9].value = data.name_sensor || '';
  // inputs[10].value = data.total_value_consumables || '';

    // Helper: convertir a número manejando comas, puntos y símbolos
    const parseNumber = (v) => {
      if (v == null || v === '') return NaN;
      if (typeof v === 'number') return v;
      let s = String(v).trim();
      // eliminar símbolos de moneda y espacios
      s = s.replace(/[^0-9,\.\-]/g, '');
      if (s === '') return NaN;
      const hasDot = s.indexOf('.') !== -1;
      const hasComma = s.indexOf(',') !== -1;
      if (hasDot && hasComma) {
        // Si hay ambos, asumir que '.' es separador de miles y ',' decimal (ej: 1.234,56)
        if (s.indexOf('.') < s.indexOf(',')) {
          s = s.replace(/\./g, '').replace(/,/g, '.');
        } else {
          // caso inverso, eliminar comas
          s = s.replace(/,/g, '');
        }
      } else if (hasComma && !hasDot) {
        // solo coma -> asumir coma decimal
        s = s.replace(/,/g, '.');
      } else {
        // solo punto o ninguno: dejar tal cual
      }
      const n = parseFloat(s);
      return isNaN(n) ? NaN : n;
    };

    // Formatear número como moneda (ej. $1.234,56)
    const formatCurrency = (value) => {
      const n = typeof value === 'number' ? value : parseNumber(value);
      if (isNaN(n)) return (value && typeof value === 'string') ? value : '—';
      try {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(n);
      } catch (e) {
        return n.toFixed(2);
      }
    };

    // Renderizar insumos detallados como bloques individuales
    const consumablesList = document.getElementById('consumables-list');
    const inversionInput = document.getElementById('inversion-input');
    if (consumablesList) {
      consumablesList.innerHTML = '';

      // Caso A: consumables es array de objetos [{name_consumables, quantity, total_value}, ...]
      let inversionTotal = 0;
      if (Array.isArray(data.consumables) && data.consumables.length > 0 && typeof data.consumables[0] === 'object') {
        data.consumables.forEach((c, idx) => {
          const name = c.name_consumables || c.consumable || c.name || '';
          const qtyRaw = c.quantity ?? c.cantidad ?? c.qty ?? '';
          const unitRaw = c.unitary_value ?? c.unitary_value_consumable ?? c.unitary_value_consumables ?? c.unit_price ?? '';
          let totalRaw = c.total_value ?? c.total_value_consumables ?? c.valor_total ?? '';

          // Normalizar y calcular
          let nTotal = parseNumber(totalRaw);
          if (isNaN(nTotal)) {
            const nQty = parseNumber(qtyRaw);
            const nUnit = parseNumber(unitRaw);
            if (!isNaN(nQty) && !isNaN(nUnit)) {
              nTotal = nQty * nUnit;
              totalRaw = nTotal.toFixed(2);
            }
          }
          if (!isNaN(nTotal)) inversionTotal += nTotal;
          console.debug('[Inversion] item', idx, { name, qtyRaw, unitRaw, totalRaw, nTotal, inversionTotal });

          const displayQty = qtyRaw ?? '';
          const displayTotal = (!isNaN(nTotal) ? formatCurrency(nTotal) : (totalRaw || '—'));

          const block = document.createElement('div');
          block.className = 'integrator__consumable-block';
          block.innerHTML = `
            <div class="integrator__block-header">${name}</div>
            <div class="integrator__block-body">
              <div><strong>Cantidad usada:</strong> ${displayQty}</div>
              <div><strong>Valor total:</strong> ${displayTotal}</div>
            </div>
          `;
          consumablesList.appendChild(block);
        });
      } else {
        // Caso B: datos en arrays paralelos: consumables: [names], quantity_consumables: [nums], unitary_value_consumables: [nums]
        const names = Array.isArray(data.consumables) ? data.consumables : [];
        const quantities = Array.isArray(data.quantity_consumables) ? data.quantity_consumables : [];
        const unitaries = Array.isArray(data.unitary_value_consumables) ? data.unitary_value_consumables : [];
        const totalsArr = Array.isArray(data.total_value_consumables) ? data.total_value_consumables : [];

        const maxLen = Math.max(names.length, quantities.length, unitaries.length, totalsArr.length);
        for (let i = 0; i < maxLen; i++) {
          const name = names[i] ?? '';
          const qtyRaw = quantities[i] ?? '';
          const unitRaw = unitaries[i] ?? '';
          let totalRaw = totalsArr[i] ?? '';

          let nTotal = parseNumber(totalRaw);
          if (isNaN(nTotal) && qtyRaw !== '' && unitRaw !== '') {
            const nQty = parseNumber(qtyRaw);
            const nUnit = parseNumber(unitRaw);
            if (!isNaN(nQty) && !isNaN(nUnit)) {
              nTotal = nQty * nUnit;
              totalRaw = nTotal.toFixed(2);
            }
          }
          if (!isNaN(nTotal)) inversionTotal += nTotal;
          console.debug('[Inversion] idx', i, { name, qtyRaw, unitRaw, totalRaw, nTotal, inversionTotal });

          const displayQty = qtyRaw !== '' ? qtyRaw : '—';
          const displayUnit = !isNaN(parseNumber(unitRaw)) ? formatCurrency(unitRaw) : (unitRaw !== '' ? unitRaw : '—');
          const displayTotal = !isNaN(nTotal) ? formatCurrency(nTotal) : (totalRaw || '—');

          const block = document.createElement('div');
          block.className = 'integrator__consumable-block';
          block.innerHTML = `
            <div class="integrator__block-header">${name || '—'}</div>
            <div class="integrator__block-body">
              <div><strong>Cantidad usada:</strong> ${displayQty}</div>
              <div><strong>Valor unitario:</strong> ${displayUnit}</div>
              <div><strong>Valor total:</strong> ${displayTotal}</div>
            </div>
          `;
          consumablesList.appendChild(block);
        }
      }

      // Mostrar inversion total en el input (si existe)
      if (inversionInput) {
        inversionInput.value = formatCurrency(inversionTotal || 0);
      }
    }

  // Renderizar sensores detallados como bloques individuales
  const sensorsList = document.getElementById('sensors-list');
  if (sensorsList) {
    sensorsList.innerHTML = '';

    // Preferir claves comunes donde pueden venir los sensores
    let sensorsArr = null;
    if (Array.isArray(data.name_sensor)) sensorsArr = data.name_sensor;
    else if (Array.isArray(data.sensors)) sensorsArr = data.sensors;
    else if (Array.isArray(data.sensor)) sensorsArr = data.sensor;

    // Si sensorsArr es array de objetos, recorrer objetos
    if (Array.isArray(sensorsArr) && sensorsArr.length > 0 && typeof sensorsArr[0] === 'object') {
      sensorsArr.forEach(s => {
        const name = s.name_sensor || s.name || s.sensor_name || s.nombre || s.nombre_sensor || '';
        const type = s.type_sensor || s.type || s.sensor_type || s.tipo || '';

        const block = document.createElement('div');
        block.className = 'integrator__sensor-block';
        block.innerHTML = `
            <div class="integrator__block-header">${name || '—'}</div>
            <div class="integrator__block-body">
              <div><strong>Tipo:</strong> ${type || '—'}</div>
            </div>
          `;
        sensorsList.appendChild(block);
      });
    } else if (Array.isArray(sensorsArr) && sensorsArr.length > 0 && typeof sensorsArr[0] === 'string') {
      // Caso: names array y tipos en array paralelo (buscar arrays de tipos comunes)
      const names = sensorsArr;
      const possibleTypeKeys = ['type_sensor', 'type_sensors', 'types_sensor', 'sensor_type', 'sensor_types', 'type', 'tipos', 'tipo_sensor', 'tipo'];
      let types = null;
      for (const k of possibleTypeKeys) {
        if (Array.isArray(data[k])) { types = data[k]; break; }
      }

      const maxLen = Math.max(names.length, types ? types.length : 0);
      for (let i = 0; i < maxLen; i++) {
        const name = names[i] ?? '—';
        const type = (types && types[i]) ? types[i] : '—';

        const block = document.createElement('div');
        block.className = 'integrator__sensor-block';
        block.innerHTML = `
            <div class="integrator__block-header">${name}</div>
            <div class="integrator__block-body">
              <div><strong>Tipo:</strong> ${type}</div>
            </div>
          `;
        sensorsList.appendChild(block);
      }
    } else {
      // Fallback: mostrar mensaje si no hay sensores
      const empty = document.createElement('div');
      empty.className = 'integrator__sensor-block';
      empty.innerHTML = `<div class="integrator__block-body">No hay sensores disponibles</div>`;
      sensorsList.appendChild(empty);
    }
  }
});

