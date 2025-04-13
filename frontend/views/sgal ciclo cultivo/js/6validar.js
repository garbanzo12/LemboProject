// Validador de formularios
console.log('"No es lo que te ocurre, sino cómo reaccionas, lo que importa" (Epicteto)');
try {
  // Objeto para almacenar los datos del formulario
  const cycleData = {
    nuevoIdCiclo: '',
    nuevoNombreCiclo: '',
    nuevoNovedad: '',
    nuevoTamanoM2: ''
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight__form');
  const idCiclo = document.querySelector('.nuevo-idCiclo');
  const nombreCiclo = document.querySelector('.nuevo-nombreCiclo');
  const novedad = document.querySelector('.nuevo-novedad');
  const tamanoM2 = document.querySelector('.nuevo-tamanoM2');

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { nuevoIdCiclo, nuevoNombreCiclo, nuevoNovedad, nuevoTamanoM2 } = cycleData;
    console.log('Enviando formulario...');

    if (
      nuevoIdCiclo === '' ||
      nuevoNombreCiclo === '' ||
      nuevoNovedad === '' ||
      nuevoTamanoM2 === ''
    ) {
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
  });

  // Escuchamos los eventos de los campos usando las nuevas clases
  idCiclo.addEventListener('input', readText);
  nombreCiclo.addEventListener('input', readText);
  novedad.addEventListener('input', readText);
  tamanoM2.addEventListener('input', readText);

  // Callback para leer los datos de cada campo
  function readText(e) {
    if (e.target.classList.contains('nuevo-idCiclo')) {
      cycleData.nuevoIdCiclo = e.target.value;
    }
    if (e.target.classList.contains('nuevo-nombreCiclo')) {
      cycleData.nuevoNombreCiclo = e.target.value;
    }
    if (e.target.classList.contains('nuevo-novedad')) {
      cycleData.nuevoNovedad = e.target.value;
    }
    if (e.target.classList.contains('nuevo-tamanoM2')) {
      cycleData.nuevoTamanoM2 = e.target.value;
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
      location.href = "/SGL CODE/sgal ciclo cultivo/html/MODAL_CREAR.html";
    }
    useForm.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
} catch (error) {
  console.log(error);
}
