// Validador de formularios
console.log('"La vida no es un problema a ser resuelto, es una realidad a experimentar" (Soren Kierkegaard)');
try {
  // Objeto para almacenar los datos del formulario
  const userData = {
    userName: '',
    userPasword: ''
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cardRigth__form');
  const userName = document.querySelector('.userName');
  const userPasword = document.querySelector('.userPasword');
  

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { userName, userPasword } = userData;

    console.log('Enviando formulario...');

    if (
      userName === '' ||
      userPasword === '' 
    ){
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
  });

  // Escuchamos los eventos de los campos
  userName.addEventListener('input', readText);
  userPasword.addEventListener('change', readText);
 

  // Callback para leer los datos de cada campo
  function readText(e) {
    if (e.target.classList.contains('userName')) {
      userData.userName = e.target.value;
    }
    if (e.target.classList.contains('userPasword')) {
      userData.userPasword = e.target.value;
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
      location.href ="../sgal main (sanchez)/index_main.html";

    }
    useForm.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
} catch (error) {
  console.log(error);
}
