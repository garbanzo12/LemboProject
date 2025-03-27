// Validador de formularios
console.log('Albert Einstein:"La imaginación es más importante que el conocimiento  ')
try {
    // Objeto para almacenar los datos del formulario
    const userData = {
      ciclo__ID: ''
     
    };
  
    // Seleccionamos elementos del DOM
    // let activo = true;
    const useForm = document.querySelector('.cicloRight__form');
    const ciclo__ID = document.querySelector('.ciclo__ID');

  
    // Evento submit
    useForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const { ciclo__ID } = userData;
  
      console.log('Enviando formulario...');
  
      if (
        ciclo__ID === ''  
      ) {
        showAlert('Todos los campos son obligatorios');
      } else {
        showAlert('Todos los campos son correctos', true);
      }
  
      // Aquí podrías limpiar o procesar el formulario si es necesario
    });
  
    // Escuchamos los eventos de los campos
    ciclo__ID.addEventListener('input', readText);

    
  
    // Callback para leer los datos de cada campo
    function readText(e) {
      if (e.target.classList.contains('ciclo__ID')) {
        userData.ciclo__ID = e.target.value;
      }
    }
  
    // Función para mostrar alertas en el formulario
    function showAlert(message, error = null) {
      // if (activo) {
      const alert = document.createElement('p');
      console.log(message);
      alert.textContent = message;
      if (error == null) {

        alert.classList.add('error');
      } else {

        alert.classList.add('correcto');
        
        location.href ="../Html/3-visualizar-usuario.html";
      }
      useForm.appendChild(alert);
      setTimeout(() => {
        alert.remove();
      }, 2000);
      // return activo = false;
    // }
  }
  } catch (error) {
    console.log(error);
  }
  