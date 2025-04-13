// Validador de formularios
console.log('"No es lo que te ocurre, sino cómo reaccionas, lo que importa" (Epicteto)');
try {
  // Objeto para almacenar los datos del formulario
  const cycleData = {
    idCiclo: '',
    nombreCiclo: '',
    novedad: '',
    tamanoM2: ''
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight__form');
  const inputIdCiclo = document.querySelector('.dato-idCiclo');
  const inputNombreCiclo = document.querySelector('.dato-nombreCiclo');
  const inputNovedad = document.querySelector('.dato-novedad');
  const inputTamanoM2 = document.querySelector('.dato-tamanoM2');

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { idCiclo, nombreCiclo, novedad, tamanoM2 } = cycleData;
    console.log('Enviando formulario...');

    if (
      idCiclo === '' ||
      nombreCiclo === '' ||
      novedad === '' ||
      tamanoM2 === ''
    ) {
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
  });

  // Escuchamos los eventos de los campos usando las nuevas clases
  inputIdCiclo.addEventListener('input', readText);
  inputNombreCiclo.addEventListener('input', readText);
  inputNovedad.addEventListener('input', readText);
  inputTamanoM2.addEventListener('input', readText);

  // Callback para leer los datos de cada campo
  function readText(e) {
    if (e.target.classList.contains('dato-idCiclo')) {
      cycleData.idCiclo = e.target.value;
    }
    if (e.target.classList.contains('dato-nombreCiclo')) {
      cycleData.nombreCiclo = e.target.value;
    }
    if (e.target.classList.contains('dato-novedad')) {
      cycleData.novedad = e.target.value;
    }
    if (e.target.classList.contains('dato-tamanoM2')) {
      cycleData.tamanoM2 = e.target.value;
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
