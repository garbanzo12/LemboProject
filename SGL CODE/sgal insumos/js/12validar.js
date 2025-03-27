// Validador de formularios
console.log('La tragedia del hombre moderno no es que sabe cada vez menos sobre el sentido de su propia vida, sino que se preocupa cada vez menos por ello.Václav Havel ');
try {
  // Objeto para almacenar los ciclo__IDs del formulario
  const cycleData = {
    data: '',
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight');
  const data = document.querySelector('.ciclo__ID');
  

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { data} = cycleData;
    console.log('Enviando formulario...');

    if (
      data === '' 
    ) {
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
  });

  // Escuchamos los eventos de los campos usando las nuevas clases
  data.addEventListener('input', readText);
  
  // Callback para leer los ciclo__IDs de cada campo
  function readText(e) {
    if (e.target.classList.contains('ciclo__ID')) {
      cycleData.data = e.target.value;
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
      location.href = "/SGL CODE/sgal insumos/Html/3-visualizar-insumo.html";
    }
    useForm.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
} catch (error) {
  console.log(error);
}
