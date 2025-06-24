// Validador de formularios
console.log('"Hay que darle un sentido a la vida, por el hecho mismo de que carece de sentido.Henry Miller');
try {
  // Objeto para almacenar los datos del formulario
  const userData = {
    nuevoTipoUsuario: '',
    nuevoTipoDocumento: '',
    nuevoNombreUsuario: '',
    nuevoEmailUsuario: '',
    nuevoNumeroContacto: ''
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight__form');
  const tipoUsuario = document.querySelector('.nuevo-tipoUsuario');
  const tipoDocumento = document.querySelector('.nuevo-tipoDocumento');
  const nombreUsuario = document.querySelector('.nuevo-nombreUsuario');
  const emailUsuario = document.querySelector('.nuevo-emailUsuario');
  const numeroContacto = document.querySelector('.nuevo-numeroContacto');

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { nuevoTipoUsuario, nuevoNombreUsuario, nuevoEmailUsuario, nuevoNumeroContacto } = userData;
    console.log('Enviando formulario...');

    if (
      nuevoTipoUsuario === '' ||
      nuevoNombreUsuario === '' ||
      nuevoEmailUsuario === '' ||
      nuevoNumeroContacto === ''
    ) {
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
  });

  // Escuchamos los eventos de los campos usando las nuevas clases
  tipoUsuario.addEventListener('input', readText);
  tipoDocumento.addEventListener('change', readText);
  nombreUsuario.addEventListener('input', readText);
  emailUsuario.addEventListener('input', readText);
  numeroContacto.addEventListener('input', readText);

  // Callback para leer los datos de cada campo
  function readText(e) {
    if (e.target.classList.contains('nuevo-tipoUsuario')) {
      userData.nuevoTipoUsuario = e.target.value;
    }
    if (e.target.classList.contains('nuevo-tipoDocumento')) {
      userData.nuevoTipoDocumento = e.target.value;
    }
    if (e.target.classList.contains('nuevo-nombreUsuario')) {
      userData.nuevoNombreUsuario = e.target.value;
    }
    if (e.target.classList.contains('nuevo-emailUsuario')) {
      userData.nuevoEmailUsuario = e.target.value;
    }
    if (e.target.classList.contains('nuevo-numeroContacto')) {
      userData.nuevoNumeroContacto = e.target.value;
    }
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
