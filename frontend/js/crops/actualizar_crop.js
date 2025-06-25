document.addEventListener('DOMContentLoaded', () => {
  const cropSelect = document.querySelector('.cardright__selectid'); // ⬅️ Tomo del DOM a el select donde van a ir los IDS
  const cropForm = document.querySelector('.cardright__form'); // ⬅️ Tomo del DOM a el form 
  let currentID = null; // ⬅️ Incializo la variable donde voy a guardar el id en null

  if (cropSelect && (cropSelect.tagName === 'SELECT' || cropSelect.type === 'text')) { // ⬅️  Hago validaciones
    const choices = new Choices(cropSelect); // ⬅️ Estoy llamand a mi dependencia choices para el select
  // Inicializar Choices.js después de llenar las opciones
 
    fetch('http://localhost:5501/crops/_id') // ⬅️ hago un fetch para traer la lista de IDS
      .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
      .then(ids => {
        const todosLosIds = ids.cultivos; // Array con todos los IDs

        choices.setChoices( // ⬅️ Los meto en el choice
          todosLosIds.map(id => ({ value: id, label: `ID: ${id}` })),
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

      fetch(`http://localhost:3000/api/crops/${id}`) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
        .then(res => {
          if (!res.ok) throw new Error('No se encontró el cultivo');
          return res.json(); // ⬅️ 
        })
        .then(data => {  // ⬅️ Los muestro por aqui
          cropForm._id.value = data._id;
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
      // const imagenInput = cropForm.elements['imagen_cultivo']; // Campo file
      const data = new FormData();
      data.append("nombre_cultivo", cropForm.nombre_cultivo.value);
      data.append("tipo_cultivo", cropForm.tipo_cultivo.value);
      data.append("ubicacion_cultivo", cropForm.ubicacion_cultivo.value);
      data.append("descripcion_cultivo", cropForm.descripcion_cultivo.value);
      data.append("tamano_cultivo", cropForm.tamano_cultivo.value);
      if (cropForm.imagen_cultivo.files[0]) {
        data.append("imagen_cultivo", cropForm.imagen_cultivo.files[0]);
      }

      fetch(`http://localhost:5501/api/crops/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
        method: 'PUT',
        body: data
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
       
        window.location.href = '5-listar_crops.html';
      })
      .catch(err => {
        console.error('Error:', err);
        alert(err.message || 'Error al actualizar');
      });
    });
  }
});



