console.log('sdfsdf');

function inicializarBuscar() { // ⬅️ Estoy creando la funcion inicializarBuscar
  const formBuscar = document.querySelector('.cicloRight__form'); // ⬅️ Estoy seleccionando el form en el DOM

  formBuscar.addEventListener('submit', async (e) => { // ⬅️ Cuando se presionada el boton de buscar sucede ⬇️
    e.preventDefault();// ⬅️ Hago un prevend default para quitar propiedades 
    const inputId = formBuscar.querySelector('input[type="number"]');// ⬅️ Selecciono un input number
    const id = inputId.value;// ⬅️ Le asigno el valor de este input a mi variale
  
    try {
      const res = await fetch(`http://localhost:5501/crops/${id}`);// ⬅️ Voy a mi bd y busco la fila que tenga mi id
      if (!res.ok) throw new Error('No se encontró el cultivo');// ⬅️ Mensaje de alerta si no se encuentra el id
      const data = await res.json();// ⬅️ Traigo desde el back el JSON con la informacion de la columna que busqué
  
      
      localStorage.setItem('cultivoSeleccionado', JSON.stringify(data));// ⬅️ Guardo los datos en localStorage 
  
      
      window.location.href = '3-visualizar-cultivo.html';// ⬅️ Mando a la otra página HTML donde visualizo los datos
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
  
}

setTimeout(() => {
  inicializarBuscar();
}, 100);


