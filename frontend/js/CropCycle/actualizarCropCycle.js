document.addEventListener('DOMContentLoaded', () => {
    const cropSelect = document.querySelector('.cardright__selectid'); // ⬅️ Tomo del DOM a el select donde van a ir los IDS
    const cropForm = document.querySelector('.cardright__form'); // ⬅️ Tomo del DOM a el form 
    let currentID = null; // ⬅️ Incializo la variable donde voy a guardar el id en null
  
    if (cropSelect && (cropSelect.tagName === 'SELECT' || cropSelect.type === 'text')) { // ⬅️  Hago validaciones
      const choices = new Choices(cropSelect); // ⬅️ Estoy llamand a mi dependencia choices para el select
    // Inicializar Choices.js después de llenar las opciones
   
      fetch('http://localhost:5501/cropcycle/id') // ⬅️ hago un fetch para traer la lista de IDS
        .then(res => res.json()) // ⬅️ Aqui estoy trallendo el paquete json
        .then(ids => {
          const todosLosIds = ids.ciclos; // Array con todos los IDs
  
          choices.setChoices( // ⬅️ Los meto en el choice
            todosLosIds.map(id => ({ value: id, label: `ID: ${id}` })),
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
  
        fetch(`http://localhost:5501/api/cropcycle/${id}`) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
          .then(res => {
            if (!res.ok) throw new Error('No se encontró el ciclo');
            return res.json(); // ⬅️ 
          })
          .then(data => {  // ⬅️ Los muestro por aqui
            const formatDate = (isoDate) => {
                return new Date(isoDate).toISOString().split('T')[0];
              };
            cropForm.id.value = data.id;
            cropForm.nombre_ciclo.value = data.name_cropCycle;
            cropForm.periodo_inicio.value = formatDate(data.period_cycle_start);
            cropForm.periodo_fin.value = formatDate(data.period_cycle_end);
            cropForm.descripcion_ciclo.value = data.description_cycle;
            cropForm.novedades_ciclo.value = data.news_cycle;
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
        const data = new FormData();
        data.append("nombre_ciclo", cropForm.nombre_ciclo.value);
        data.append("periodo_inicio", cropForm.periodo_inicio.value);
        data.append("periodo_fin", cropForm.periodo_fin.value);
        data.append("descripcion_ciclo", cropForm.descripcion_ciclo.value);
        data.append("novedades_ciclo", cropForm.novedades_ciclo.value);
      
  
        fetch(`http://localhost:5501/api/cropcycle/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
          method: 'PUT',
          body: data
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
  
  
  
  