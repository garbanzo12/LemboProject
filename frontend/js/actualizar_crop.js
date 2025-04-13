// Evento para capturar el formulario cuando se envíe
document.getElementById('cicloRight__form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional
  
    // Crear un objeto FormData con los datos del formulario
    const formData = new FormData(this);
  
    // Convertir FormData a un objeto JavaScript normal para enviarlo a la API
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    // Realizar una solicitud POST usando Fetch API para enviar los datos al servidor
    try {
      const response = await fetch('http://localhost:5501/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Decimos que estamos enviando datos en formato JSON
        },
        body: JSON.stringify(data), // Convertimos el objeto JavaScript a JSON
      });
  
      // Manejo de respuesta del servidor
      const result = await response.json(); // Si el servidor responde con JSON
  
      if (response.ok) {
        alert('Cultivo actualizado exitosamente');
      } else {
        alert('Hubo un error al actualizar el cultivo: ' + result.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Hubo un problema con la solicitud');
    }
  });
  