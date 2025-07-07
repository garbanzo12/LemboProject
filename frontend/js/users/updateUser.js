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
   
      fetch('http://localhost:3000/api/auth/search', {
    headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
    })
    .then(res => {
    if (!res.ok) throw new Error('Fallo al obtener usuarios');
    return res.json();
    })
    .then(ids => {
    const todosLosIds = ids;

     choices.setChoices(
      todosLosIds.map(id => ({ value: id._id, label: `ID: ${id.userId}` })),
      'value',
      'label',
      true
    );
    })
  .catch(err => console.error('Error al cargar IDs:', err));

  
      // Selección de un ciclo
      cropSelect.addEventListener('change', () => {  // ⬅️ Para cuando se selecciona otro ID se cambie el valor de la variable currentID
        const id = cropSelect.value;
        if (!id) return;
  
        currentID = id;

        fetch(`http://localhost:3000/api/auth/${id}`, {
          headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
          }) // ⬅️ Por medio del ID traigo la columna correspondiente( anteriormente la traje tambien, pero para cargar el select, ahora es para los inputs)
          .then(res => {
            if (!res.ok) throw new Error('No se encontró el ciclo');
            return res.json(); // ⬅️ 
          })
          .then(data => {  // ⬅️ Los muestro por aqui
            const formatDate = (isoDate) => {
                return new Date(isoDate).toISOString().split('T')[0];
              };

            cropForm.tipo_usuario.value = data.type_user;
            cropForm.tipo_documento.value = data.type_ID;
            cropForm.numero_documento.value = data.num_document_identity;
            cropForm.nombre_usuario.value = data.name_user;
            cropForm.correo.value = data.email;
            cropForm.numero_contacto.value = data.cellphone;
            
             // Asignar valor desde la base de datos al campo
            cropForm.estado_usuario.value = data.estado_usuario;
            if(cropForm.estado_usuario.value == 'undefined'){
                cropForm.estado_usuario.value = 'habilitado'
            }    
            // Actualizar el estado del checkbox
            toggleCheckbox.checked = data.estado_usuario === 'deshabilitado';
                    
            console.log('Estado inicial:', cropForm.estado_usuario.value);
                    
            // Escuchar cambios en el checkbox para actualizar el campo oculto
            toggleCheckbox.addEventListener('change', () => {
                cropForm.estado_usuario.value = toggleCheckbox.checked ? 'deshabilitado' : 'habilitado';
                console.log('Estado cambiado:', cropForm.estado_usuario.value);
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
        "tipo_usuario" : cropForm.tipo_usuario.value,
        "tipo_documento" : cropForm.tipo_documento.value,
        "numero_documento" : cropForm.numero_documento.value,
        "nombre_usuario" : cropForm.nombre_usuario.value,
        "correo" : cropForm.correo.value,
        "estado_usuario" : cropForm.estado_usuario.value,
        
        }
        console.log("Enviando ID:", currentID);
        console.log(JSON.stringify(data));

        fetch(`http://localhost:3000/api/auth/update/${currentID}`, { // ⬅️ Mandamos con fetch la actualizacion con su id correspondiente
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
          window.location.href = '5-listar_users.html';
         
         })
        .catch(err => {
          console.error('Error:', err);
          alert(err.message || 'Error al actualizar');
        });
      });
    }
  });
  
  
  
  