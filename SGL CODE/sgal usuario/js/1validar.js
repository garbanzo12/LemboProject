// Validador de formularios
console.log('Friedrich Nietzsche: "Aquel que tiene algo por qué vivir es capaz de enfrentar todos los cómos"  ')
try {
    // Objeto para almacenar los datos del formulario
    const userData = {
      ciclo__user: '',
      ciclo__document: '',
      ciclo__nameUser: '',
      ciclo__email: '',
      ciclo__cellPhone: ''
    };
  
    // Seleccionamos elementos del DOM
    const useForm = document.querySelector('.cicloRight__form');
    const ciclo__user = document.querySelector('.ciclo__user');
    const ciclo__document = document.querySelector('.ciclo__document');
    const ciclo__nameUser = document.querySelector('.ciclo__nameUser');
    const ciclo__email = document.querySelector('.ciclo__email');
    const ciclo__cellPhone = document.querySelector('.ciclo__cellPhone');
  
    // Evento submit
    useForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const { ciclo__user, ciclo__nameUser, ciclo__email, ciclo__cellPhone } = userData;
  
      console.log('Enviando formulario...');
  
      if (
        ciclo__user === ''  ||
        ciclo__nameUser === '' ||
        ciclo__email === '' ||
        ciclo__cellPhone === ''
      ) {
        showAlert('Todos los campos son obligatorios');
      } else {
        showAlert('Todos los campos son correctos', true);
      }
  
      // Aquí podrías limpiar o procesar el formulario si es necesario
    });
  
    // Escuchamos los eventos de los campos
    ciclo__user.addEventListener('input', readText);
    // Para el select se usa "change"
    ciclo__document.addEventListener('change', readText);
    ciclo__nameUser.addEventListener('input', readText);
    ciclo__email.addEventListener('input', readText);
    ciclo__cellPhone.addEventListener('input', readText);
  
    // Callback para leer los datos de cada campo
    function readText(e) {
      if (e.target.classList.contains('ciclo__user')) {
        userData.ciclo__user = e.target.value;
      }
      if (e.target.classList.contains('ciclo__document')) {
        userData.ciclo__document = e.target.value;
      }
      if (e.target.classList.contains('ciclo__nameUser')) {
        userData.ciclo__nameUser = e.target.value;
      }
      if (e.target.classList.contains('ciclo__email')) {
        userData.ciclo__email = e.target.value;
      }
      if (e.target.classList.contains('ciclo__cellPhone')) {
        userData.ciclo__cellPhone = e.target.value;
      }
      // console.log(userData);
    }
  
    // Función para mostrar alertas en el formulario
    function showAlert(message, error = null) {
      const alert = document.createElement('p');
      console.log(message);
      alert.textContent = message;
      if (error == null) {

        alert.classList.add('error');
      } else {

        alert.classList.add('correcto');
        location.href ="/SGL CODE/sgal main (sanchez)/index_main.html";
      }
      useForm.appendChild(alert);
      setTimeout(() => {
        alert.remove();
      }, 2000);
    }
  } catch (error) {
    console.log(error);
  }
  