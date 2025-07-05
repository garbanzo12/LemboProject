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
   
      fetch('http://localhost:3000/api/auth') // ⬅️ hago un fetch para traer la lista de IDS
        .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
        .then(ids => {
          const todosLosIds = ids; // Array con todos los IDs
  
          choices.setChoices( // ⬅️ Los meto en el choice
            todosLosIds.map(id => ({ value: id._id, label: `ID: ${id.consumableId}` })),
            'value',
            'label',
            true
          );
          
        })
        .catch(err => console.error('Error al cargar IDs:', err)); // ⬅️ 
  
      // Selección de un ciclo
      cropSelect.addEventListener('change', () => {  // ⬅️ Para cuando se selecciona otro ID se cambie el valor de la variable currentID
        const id = cropSelect.value;
        if (!id) return;
  
        currentID = id;

        fetch(`http://localhost:3000/api/auth/${id}`) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
          .then(res => {
            if (!res.ok) throw new Error('No se encontró el ciclo');
            return res.json(); // ⬅️ 
          })
          .then(data => {  // ⬅️ Los muestro por aqui
            const formatDate = (isoDate) => {
                return new Date(isoDate).toISOString().split('T')[0];
              };

            cropForm.tipo_insumo.value = data.type_consumables;
            cropForm.nombre_insumo.value = (data.name_consumables);
            cropForm.cantidad_insumo.value = (data.quantity_consumables);
            cropForm.unidad_insumo.value = data.unit_consumables;
            cropForm.unidad_valor.value = data.unitary_value;
            cropForm.total_valor.value = data.total_value;
            cropForm.descripcion_insumo.value = data.description_consumables;
            
             // Asignar valor desde la base de datos al campo
            cropForm.estado_insumo.value = data.estado_insumo;
            if(cropForm.estado_insumo.value == 'undefined'){
                cropForm.estado_insumo.value = 'habilitado'
            }    
            // Actualizar el estado del checkbox
            toggleCheckbox.checked = data.estado_insumo === 'deshabilitado';
                    
            console.log('Estado inicial:', cropForm.estado_insumo.value);
                    
            // Escuchar cambios en el checkbox para actualizar el campo oculto
            toggleCheckbox.addEventListener('change', () => {
                cropForm.estado_insumo.value = toggleCheckbox.checked ? 'deshabilitado' : 'habilitado';
                console.log('Estado cambiado:', cropForm.estado_insumo.value);
            });
        })
    .catch(err => {
      console.error('Error al cargar datos del ciclo:', err);
      alert('No se pudo cargar el ciclo seleccionado.');
    });
      });
    }
  
    // Enviar datos al backend
    if (cropForm) {
      cropForm.addEventListener('submit', (e) => { // ⬅️ Cuando se haga el sumbit
        e.preventDefault();
        if (!currentID) { // ⬅️ Validacion para que elija el id
          alert('Por favor selecciona un ciclo para actualizar.');
          return;
        }
        // const imagenInput = cropForm.elements['imagen_ciclo']; // Campo file
        const data = {
        "tipo_insumo" : cropForm.tipo_insumo.value,
        "nombre_insumo" : cropForm.nombre_insumo.value,
        "cantidad_insumo" : cropForm.cantidad_insumo.value,
        "unidad_insumo" : cropForm.unidad_insumo.value,
        "unidad_valor" : cropForm.unidad_valor.value,
        "total_valor" : cropForm.total_valor.value,
        "estado_insumo" : cropForm.estado_insumo.value,
        "descripcion_insumo" : cropForm.descripcion_insumo.value,
        }
  
        fetch(`http://localhost:3000/api/auth/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
          method: 'PUT',
          headers: {
        'Content-Type': 'application/json',
         Authorization: 'Bearer ' + localStorage.getItem('token') // si usas JWT
        },
          body: JSON.stringify( data )
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
         
          window.location.href = '5-listar_insumes.html';
        })
        .catch(err => {
          console.error('Error:', err);
          alert(err.message || 'Error al actualizar');
        });
      });
    }
  });
  
  
  
  