document.addEventListener('DOMContentLoaded', () => {
  const cropSelect = document.querySelector('.select-choices'); // ⬅️ Tomo del DOM a el select donde van a ir los IDS
  const cropForm = document.querySelector('.cicloRight__form'); // ⬅️ Tomo del DOM a el form 
  let currentID = null; // ⬅️ Incializo la variable donde voy a guardar el id en null

  if (cropSelect && (cropSelect.tagName === 'SELECT' || cropSelect.type === 'text')) { // ⬅️  Hago validaciones
    const choices = new Choices(cropSelect); // ⬅️ Estoy llamand a mi dependencia choices para el select

  
    fetch('http://localhost:5501/crops') // ⬅️ hago unfetch para traer la lista de IDS
      .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
      .then(ids => {
        choices.setChoices( // ⬅️ Los meto en el choice
          ids.cultivos.map(c => ({ value: c.id, label: `ID: ${c.id}` })),
          'value',
          'label',
          true
        );
      })
      .catch(err => console.error('Error al cargar IDs:', err)); // ⬅️ 

    // Selección de un cultivo
    cropSelect.addEventListener('change', () => {  // ⬅️ Para cuando se selecciona otro ID se cambie el valor de la variable currentID
      const id = cropSelect.value;
      if (!id) return;

      currentID = id;

      fetch(`http://localhost:5501/crops/${id}`) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
        .then(res => {
          if (!res.ok) throw new Error('No se encontró el cultivo');
          return res.json(); // ⬅️ 
        })
        .then(data => {  // ⬅️ Los muestro por aqui
          cropForm.id.value = data.id;
          cropForm.nombre_cultivo.value = data.name_crop;
          cropForm.tipo_cultivo.value = data.type_crop;
          cropForm.ubicacion_cultivo.value = data.location;
          cropForm.descripcion_cultivo.value = data.description_crop;
          cropForm.tamano_cultivo.value = data.size_m2;
        })
        .catch(err => {
          console.error('Error al cargar datos del cultivo:', err);
          alert('No se pudo cargar el cultivo seleccionado.');
        });
    });
  }

  // Enviar datos al backend
  if (cropForm) {
    cropForm.addEventListener('submit', (e) => { // ⬅️ Cuando se haga el sumbit
      e.preventDefault();
      if (!currentID) { // ⬅️ Validacion para que elija el id
        alert('Por favor selecciona un cultivo para actualizar.');
        return;
      }

      const data = { // ⬅️ Anteriormente se hizo un data para mostrar los valores, este es para mandarlos en json al backend
        id: currentID,
        nombre_cultivo: cropForm.nombre_cultivo.value,
        tipo_cultivo: cropForm.tipo_cultivo.value,
        ubicacion_cultivo: cropForm.ubicacion_cultivo.value,
        descripcion_cultivo: cropForm.descripcion_cultivo.value,
        tamano_cultivo: cropForm.tamano_cultivo.value,
      };

      fetch(`http://localhost:5501/crops/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => {
          if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
          window.location.href = '5-listar-cultivos.html';
          return res.json();
        })
        .then(msg => {
          alert(msg.message || 'Cultivo actualizado con éxito');
        })
        .catch(err => {
          console.error('Error al enviar datos:', err);
          alert('Hubo un problema al actualizar el cultivo.');
        });
    });
  }
});
