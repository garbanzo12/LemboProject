// Validador de formularios
console.log('El hecho de que la vida no tenga ningún sentido es una razón para vivir, la única, en realidad.Emil Cioran ');
try {
  // Objeto para almacenar los datos del insumo
  const insumoData = {
    idInsumo: '',
    tipoInsumo: '',
    nombreInsumo: '',
    cantidad: '',
    unidadMedida: '',
    valorUnitario: '',
    valorTotal: '',
    descripcion: ''
  };

  // Seleccionamos elementos del DOM usando las clases reales del HTML
  // Los inputs que tienen clase "ciclo__nameUser" aparecen en este orden:
  // [0]: Id Insumo, [1]: Tipo de Insumo, [2]: Unidad de Medida, [3]: Valor Unitario, [4]: Valor Total, [5]: Descripción
  const inputsNameUser = document.querySelectorAll('.ciclo__nameUser');
  const inputNombreInsumo = document.querySelector('.ciclo__email');
  const inputCantidad = document.querySelector('.ciclo__cellPhone');

  // Seleccionamos el formulario
  const useForm = document.querySelector('.cicloRight__form');

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const {
      idInsumo,
      tipoInsumo,
      nombreInsumo,
      cantidad,
      unidadMedida,
      valorUnitario,
      valorTotal,
      descripcion
    } = insumoData;
    console.log('Enviando formulario...');

    // Verifica que ningún campo esté vacío
    if (
      idInsumo === '' ||
      tipoInsumo === '' ||
      nombreInsumo === '' ||
      cantidad === '' ||
      unidadMedida === '' ||
      valorUnitario === '' ||
      valorTotal === '' ||
      descripcion === ''
    ) {
      showAlert('Todos los campos son obligatorios');
    } else {
      showAlert('Todos los campos son correctos', true);
    }
  });

  // Asignamos event listeners a cada input
  inputsNameUser[0].addEventListener('input', readText);
  inputsNameUser[1].addEventListener('input', readText);
  inputNombreInsumo.addEventListener('input', readText);
  inputCantidad.addEventListener('input', readText);
  inputsNameUser[2].addEventListener('input', readText);
  inputsNameUser[3].addEventListener('input', readText);
  inputsNameUser[4].addEventListener('input', readText);
  inputsNameUser[5].addEventListener('input', readText);

  // Función para leer los datos de cada campo, diferenciando por el elemento
  function readText(e) {
    if (e.target === inputsNameUser[0]) {
      insumoData.idInsumo = e.target.value;
    } else if (e.target === inputsNameUser[1]) {
      insumoData.tipoInsumo = e.target.value;
    } else if (e.target === inputNombreInsumo) {
      insumoData.nombreInsumo = e.target.value;
    } else if (e.target === inputCantidad) {
      insumoData.cantidad = e.target.value;
    } else if (e.target === inputsNameUser[2]) {
      insumoData.unidadMedida = e.target.value;
    } else if (e.target === inputsNameUser[3]) {
      insumoData.valorUnitario = e.target.value;
    } else if (e.target === inputsNameUser[4]) {
      insumoData.valorTotal = e.target.value;
    } else if (e.target === inputsNameUser[5]) {
      insumoData.descripcion = e.target.value;
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
