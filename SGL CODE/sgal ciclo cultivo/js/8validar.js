// Validador de formularios
console.log('"No es lo que te ocurre, sino cómo reaccionas, lo que importa" (Epicteto)');
try {
  // Objeto para almacenar los datos del formulario
  const cycleData = {
    data: '',
  };

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight');
  const data = document.querySelector('.dato');
  

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
  
  // Callback para leer los datos de cada campo
  function readText(e) {
    if (e.target.classList.contains('dato')) {
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
      location.href = "/SGL CODE/sgal main (sanchez)/index_main.html";
    }
    useForm.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
} catch (error) {
  console.log(error);
}
