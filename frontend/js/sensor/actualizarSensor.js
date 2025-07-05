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
 
    fetch('http://localhost:3000/api/sensor')// ⬅️ hago un fetch para traer la lista de IDS
      .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
      .then(ids => {
        console.log('Respuesta del backend:', ids); // ⬅️ 🔍
        const todosLosIds = ids; // Array con todos los IDs

        choices.setChoices( // ⬅️ Los meto en el choice
          todosLosIds.map(id => ({ value: id._id, label: `ID: ${id.sensorId}` })),
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

      fetch(`http://localhost:3000/api/sensor/${id}`) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
        .then(res => {
          if (!res.ok) throw new Error('No se encontró el cultivo');
          return res.json(); // ⬅️ 
        })
        .then(data => {  // ⬅️ Los muestro por aqui
          cropForm.tipo_sensor.value = data.type_sensor;
          cropForm.nombre_sensor.value = data.name_sensor;
          cropForm.unidad_sensor.value = data.unit_sensor;
          cropForm.tiempo_sensor.value = data.time_sensor;
          cropForm.unidad_tiempo_sensor.value = data.unit_time_sensor;
          cropForm.descripcion_sensor.value = data.description_sensor;
           // Asignar valor desde la base de datos al campo
            cropForm.estado_sensor.value = data.estado_sensor;
            if(cropForm.estado_sensor.value == 'undefined'){
                cropForm.estado_sensor.value = 'habilitado'
            }    
            // Actualizar el estado del checkbox
            toggleCheckbox.checked = data.estado_sensor === 'deshabilitado';
                    
            console.log('Estado inicial:', cropForm.estado_sensor.value);
                    
            // Escuchar cambios en el checkbox para actualizar el campo oculto
            toggleCheckbox.addEventListener('change', () => {
                cropForm.estado_sensor.value = toggleCheckbox.checked ? 'deshabilitado' : 'habilitado';
                console.log('Estado cambiado:', cropForm.estado_sensor.value);
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
      // const imagenInput = cropForm.elements['imagen_sensor']; // Campo file
      const data = new FormData();
      data.append("tipo_sensor", cropForm.tipo_sensor.value);
      data.append("nombre_sensor", cropForm.nombre_sensor.value);
      data.append("unidad_sensor", cropForm.unidad_sensor.value);
      data.append("tiempo_sensor", cropForm.tiempo_sensor.value);
      data.append("unidad_tiempo_sensor", cropForm.unidad_tiempo_sensor.value);
      data.append("descripcion_sensor", cropForm.descripcion_sensor.value);
      data.append("estado_sensor", cropForm.estado_sensor.value);

      if (cropForm.imagen_sensor.files[0]) {
        data.append("imagen_sensor", cropForm.imagen_sensor.files[0]);
      }

      fetch(`http://localhost:3000/api/sensor/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
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



