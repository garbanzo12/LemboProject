// Validador de formularios
console.log('"La vida es una obra de arte, no una tarea por terminar" (Albert Einstein)');
try {
  // Objeto para almacenar los datos del formulario
  const userData = {
    ciclo__user: '',
    ciclo__document: '',
    ciclo__nameUser: '',
    ciclo__email: '',
    ciclo__cellPhone: ''
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight__form');
  const ciclo__user = document.querySelector('.input-tipoUsuario');
  const ciclo__document = document.querySelector('.select-tipoDocumento');
  const ciclo__nameUser = document.querySelector('.input-nombreUsuario');
  const ciclo__email = document.querySelector('.input-email');
  const ciclo__cellPhone = document.querySelector('.input-numeroContacto');

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { ciclo__user, ciclo__nameUser, ciclo__email, ciclo__cellPhone } = userData;

    console.log('Enviando formulario...');

    if (
      ciclo__user === '' ||
      ciclo__email === '' ||
      ciclo__cellPhone === ''||
      ciclo__nameUser === ''
    ){
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
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
    if (e.target.classList.contains('input-tipoUsuario')) {
      userData.ciclo__user = e.target.value;
    }
    if (e.target.classList.contains('select-tipoDocumento')) {
      userData.ciclo__document = e.target.value;
    }
    if (e.target.classList.contains('input-nombreUsuario')) {
      userData.ciclo__nameUser = e.target.value;
    }
    if (e.target.classList.contains('input-email')) {
      userData.ciclo__email = e.target.value;
    }
    if (e.target.classList.contains('input-numeroContacto')) {
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
      location.href ="/SGL CODE/sgal usuario/Html/4-actualizar-usuario.html";

    }
    useForm.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
} catch (error) {
  console.log(error);
}
