document.addEventListener('DOMContentLoaded', () => {
  const toggleCheckbox = document.getElementById('toggle-color');
  if (toggleCheckbox) {
      // Estilos iniciales
      toggleCheckbox.style.appearance = 'none';
      toggleCheckbox.style.width = window.innerWidth > 768 ? '20rem' : '20rem';
      toggleCheckbox.style.marginLeft = window.innerWidth > 768 ? '-7rem' :  '1rem';
      toggleCheckbox.style.height = '2rem';
      toggleCheckbox.style.borderRadius = '1rem';
      toggleCheckbox.style.backgroundColor = '#4CAF50';
      toggleCheckbox.style.position = 'relative';
      toggleCheckbox.style.cursor = 'pointer';
      toggleCheckbox.style.transition = 'background-color 0.3s';
      toggleCheckbox.style.setProperty('--thumb-color', '#ffffff');
      toggleCheckbox.style.setProperty('--unchecked-color', '#cccccc');
      toggleCheckbox.style.setProperty('--checked-color', '#4CAF50');
   
      
      
      toggleCheckbox.addEventListener('change', function() {
          this.style.backgroundColor = this.checked ? 'var(--checked-color)' : 'var(--unchecked-color)';
      });
  }
  const cropSelect = document.querySelector('.cardright__selectid'); // ⬅️ Tomo del DOM a el select donde van a ir los IDS
  const cropForm = document.querySelector('.cardright__form'); // ⬅️ Tomo del DOM a el form 
  let currentID = null; // ⬅️ Incializo la variable donde voy a guardar el id en null

  if (cropSelect && (cropSelect.tagName === 'SELECT' || cropSelect.type === 'text')) { // ⬅️  Hago validaciones
    const choices = new Choices(cropSelect); // ⬅️ Estoy llamand a mi dependencia choices para el select
  // Inicializar Choices.js después de llenar las opciones
 
    fetch('http://localhost:3000/api/crops')// ⬅️ hago un fetch para traer la lista de IDS
      .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
      .then(ids => {
        console.log('Respuesta del backend:', ids); // ⬅️ 🔍
        const todosLosIds = ids; // Array con todos los IDs

        choices.setChoices( // ⬅️ Los meto en el choice
          todosLosIds.map(id => ({ value: id._id, label: `ID: ${id.cropId}` })),
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
          cropForm.nombre_cultivo.value = data.name_crop;
          cropForm.tipo_cultivo.value = data.type_crop;
          cropForm.ubicacion_cultivo.value = data.location;
          cropForm.descripcion_cultivo.value = data.description_crop;
          cropForm.tamano_cultivo.value = data.size_m2;
           // Asignar valor desde la base de datos al campo
            cropForm.estado_cultivo.value = data.estado_cultivo;
            if(cropForm.estado_cultivo.value == 'deshabilitado'){
                cropForm.estado_cultivo.value = 'habilitado'
            }    
            // Actualizar el estado del checkbox
            toggleCheckbox.checked = data.estado_cultivo === 'deshabilitado';
                    
            console.log('Estado inicial:', cropForm.estado_cultivo.value);
                    
            // Escuchar cambios en el checkbox para actualizar el campo oculto
            toggleCheckbox.addEventListener('change', () => {
                cropForm.estado_cultivo.value = toggleCheckbox.checked ? 'deshabilitado' : 'habilitado';
                console.log('Estado cambiado:', cropForm.estado_cultivo.value);
            });
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
      data.append("estado_cultivo", cropForm.estado_cultivo.value);

      if (cropForm.imagen_cultivo.files[0]) {
        data.append("imagen_cultivo", cropForm.imagen_cultivo.files[0]);
      }

      fetch(`http://localhost:3000/api/crops/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
        method: 'PUT',
        body: data
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        console.log(data)
        window.location.href = '5-listar_crops.html';
      })
      .catch(err => {
        console.error('Error:', err);
        alert(err.message || 'Error al actualizar');
      });
    });
  }
});



