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
   
      fetch('http://localhost:3000/api/cycle') // ⬅️ hago un fetch para traer la lista de IDS
        .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
        .then(ids => {
          const todosLosIds = ids; // Array con todos los IDs
  
          choices.setChoices( // ⬅️ Los meto en el choice
            todosLosIds.map(id => ({ value: id._id, label: `ID: ${id.cycleId}` })),
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

        fetch(`http://localhost:3000/api/cycle/${id}`) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
          .then(res => {
            if (!res.ok) throw new Error('No se encontró el ciclo');
            return res.json(); // ⬅️ 
          })
          .then(data => {  // ⬅️ Los muestro por aqui
            const formatDate = (isoDate) => {
                return new Date(isoDate).toISOString().split('T')[0];
              };

            cropForm.nombre_ciclo.value = data.name_cycle;
            cropForm.periodo_inicio.value = formatDate(data.cycle_start);
            cropForm.periodo_fin.value = formatDate(data.cycle_end);
            cropForm.descripcion_ciclo.value = data.description_cycle;
            cropForm.novedades_ciclo.value = data.news_cycle;
            
             // Asignar valor desde la base de datos al campo
            cropForm.estado_ciclo.value = data.estado_ciclo;
            if(cropForm.estado_ciclo.value == 'undefined'){
                cropForm.estado_ciclo.value = 'habilitado'
            }    
            // Actualizar el estado del checkbox
            toggleCheckbox.checked = data.estado_ciclo === 'deshabilitado';
                    
            console.log('Estado inicial:', cropForm.estado_ciclo.value);
                    
            // Escuchar cambios en el checkbox para actualizar el campo oculto
            toggleCheckbox.addEventListener('change', () => {
                cropForm.estado_ciclo.value = toggleCheckbox.checked ? 'deshabilitado' : 'habilitado';
                console.log('Estado cambiado:', cropForm.estado_ciclo.value);
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
        "nombre_ciclo" : cropForm.nombre_ciclo.value,
        "periodo_inicio" : cropForm.periodo_inicio.value,
        "periodo_fin" : cropForm.periodo_fin.value,
        "descripcion_ciclo" : cropForm.descripcion_ciclo.value,
        "novedades_ciclo" : cropForm.novedades_ciclo.value,
        "estado_ciclo" : cropForm.estado_ciclo.value,
        }
  
        fetch(`http://localhost:3000/api/cycle/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
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
         
          window.location.href = '5-listar_cicle_crops.html';
        })
        .catch(err => {
          console.error('Error:', err);
          alert(err.message || 'Error al actualizar');
        });
      });
    }
  });
  
  
  
  