 // Espera a que el DOM cargue
 document.addEventListener('DOMContentLoaded', () => { // ⬅️ Espero a que cargue el DOM
    fetch('http://localhost:5501/crops')// ⬅️ Por medio de fetch me conecto a mi bd
      .then(response => response.json())// ⬅️ Traigo desde el back mi tabla de crops
      .then(data => {// ⬅️ Con la data empeizo a trabajar
        const tbody = document.querySelector('.usuario__table tbody');// ⬅️ Selecciono usuario__table
        tbody.innerHTML = ''; // ⬅️ Esto es para limpiar tablas vacias
        data.forEach(cultivo => {// ⬅️ ForEach para recorrer las tabla
          const row = document.createElement('tr');// ⬅️ Hago una tr para hacer mis tablas en el DOM

          // ⬇️Aqui estoy insertando de forma dinamica los valores de la tabla a la tabla del DOM⬇️
          row.innerHTML = `
            <td class="usuario__table-data-cell usuario__table-data-cell--icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ...></svg>
            </td>
            <td class="usuario__table-data-cell">${cultivo.id}</td> 
            <td class="usuario__table-data-cell">${cultivo.type_crop}</td>
            <td class="usuario__table-data-cell">${cultivo.name_crop}</td>
            <td class="usuario__table-data-cell">${cultivo.location}</td>
            <td class="usuario__table-data-cell">${cultivo.size_m2}</td>
            <td class="usuario__table-data-cell">${cultivo.description_crop}</td>
          `;
          tbody.appendChild(row); // ⬅️ Las muestro en el dom con appendChild
        });
      })
      .catch(error => {
        console.error('Error cargando cultivos:', error); // ⬅️ Mensaje de error
      });
  });