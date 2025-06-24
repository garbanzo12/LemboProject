// Validador de formularios para Visualización de Insumo
console.log('Estamos en la tierra para ayudar a otros: para qué están los otros en la tierra no lo sé.W. H. Auden');

try {
  // Objeto para almacenar los datos del formulario
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

  // Seleccionamos elementos del DOM usando las nuevas clases
  const useForm = document.querySelector('.cicloRight__form');
  const inputIdInsumo = document.querySelector('.insumo__id');
  const inputTipoInsumo = document.querySelector('.insumo__tipo');
  const inputNombreInsumo = document.querySelector('.insumo__nombre');
  const inputCantidad = document.querySelector('.insumo__cantidad');
  const inputUnidadMedida = document.querySelector('.insumo__unidad');
  const inputValorUnitario = document.querySelector('.insumo__valorUnitario');
  const inputValorTotal = document.querySelector('.insumo__valorTotal');
  const inputDescripcion = document.querySelector('.insumo__descripcion');

  // Evento submit
  useForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const { idInsumo, tipoInsumo, nombreInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion } = insumoData;
    console.log('Enviando formulario...');

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

  // Escuchamos los eventos de los campos usando las nuevas clases
  inputIdInsumo.addEventListener('input', readText);
  inputTipoInsumo.addEventListener('input', readText);
  inputNombreInsumo.addEventListener('input', readText);
  inputCantidad.addEventListener('input', readText);
  inputUnidadMedida.addEventListener('input', readText);
  inputValorUnitario.addEventListener('input', readText);
  inputValorTotal.addEventListener('input', readText);
  inputDescripcion.addEventListener('input', readText);

  // Callback para leer los datos de cada campo
  function readText(e) {
    if (e.target.classList.contains('insumo__id')) {
      insumoData.idInsumo = e.target.value;
    }
    if (e.target.classList.contains('insumo__tipo')) {
      insumoData.tipoInsumo = e.target.value;
    }
    if (e.target.classList.contains('insumo__nombre')) {
      insumoData.nombreInsumo = e.target.value;
    }
    if (e.target.classList.contains('insumo__cantidad')) {
      insumoData.cantidad = e.target.value;
    }
    if (e.target.classList.contains('insumo__unidad')) {
      insumoData.unidadMedida = e.target.value;
    }
    if (e.target.classList.contains('insumo__valorUnitario')) {
      insumoData.valorUnitario = e.target.value;
    }
    if (e.target.classList.contains('insumo__valorTotal')) {
      insumoData.valorTotal = e.target.value;
    }
    if (e.target.classList.contains('insumo__descripcion')) {
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
      location.href = "/SGL CODE/sgal insumos/Html/4-actualizar-insumos.html";
    }
    useForm.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
} catch (error) {
  console.log(error);
}
