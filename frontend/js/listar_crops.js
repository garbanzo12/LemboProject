document.addEventListener('DOMContentLoaded', () => { // ⬅️ Esperamos a que cargue el DOM
  const tbody = document.querySelector('.usuario__table tbody'); // ⬅️ Seleccionamos la tabla y el tbody
  const paginacion = document.querySelector('.paginacion');// ⬅️ Esto es para la paginacion
  let paginaActual = 1;// ⬅️ Empezamos en la pagina 1

  async function obtenerCultivos(pagina = 1) { // ⬅️ funciona asincrona para traer por un fetch los datos
    try {
      const res = await fetch(`http://localhost:5501/crops?page=${pagina}`);
      const data = await res.json();

      mostrarCultivos(data.cultivos);
      mostrarPaginacion(data.total, pagina);
    } catch (err) {
      console.error('Error al obtener cultivos:', err.message);
    }
  }


  function mostrarCultivos(cultivos) { // ⬅️ Esta es la funcion para mostrar en una tabla los cultivos
    tbody.innerHTML = ''; // ⬅️ para que no se pasen de 20  filas

    cultivos.forEach(cultivo => { // ⬅️ for Each para recorrer cada fila
      const row = document.createElement('tr'); // ⬅️ Por fila se crea un tr
      // ⬇️ Estamos ingresando una td con clase usuario__table-data-cell y un svg por diseño,luego creamos dinamicamente los datos de la fila segun su propiedad⬇️
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
      tbody.appendChild(row);
    });
  }
    
  function mostrarPaginacion(totalCultivos, paginaActual) { // ⬅️ Funcion para las paginas
    const totalPaginas = Math.ceil(totalCultivos / 25);
    paginacion.innerHTML = '';// ⬅️ para que no sedupliquen los botones al presionar otro
  
    const crearBoton = (num, texto = null, isActive = false) => { // ⬅️ Creamos los botones dinamicamente
      const btn = document.createElement('button');
      btn.textContent = texto || num;
      if (isActive) btn.classList.add('activo');
      btn.addEventListener('click', () => obtenerCultivos(num));
      paginacion.appendChild(btn);
    };
  
    // Botón « anterior
    if (paginaActual > 1) { // ⬅️ Si estamos en una pagina que no sea la 1 se crea « para volver
      crearBoton(paginaActual - 1, '«');
    }
  
    if (totalPaginas <= 7) {// ⬅️ Se restringe la cantidad de botones que puede haber (7)
      for (let i = 1; i <= totalPaginas; i++) {
        crearBoton(i, null, i === paginaActual);
      }
    } else {
      crearBoton(1, null, paginaActual === 1); // ⬅️ Si no los hay se crea
  
      if (paginaActual > 4) { // ⬅️ Si hay mas de 4 botones se crea ...
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginacion.appendChild(dots);
      }
  
      const start = Math.max(2, paginaActual - 2); // ⬅️ Como la ultima pagina es fija, se muestra los siguiente 2 a la que estamos parados, ejemplom si estos en el 1, se muestra 1 2 3 ... (ultima pagina)
      const end = Math.min(totalPaginas - 1, paginaActual + 2); // ⬅️ Para el ultimo se le muestran los penultimos dos al lado de este, por ejemplom si estoy en la nueve se muestra 1 ...7 8 9
  
      for (let i = start; i <= end; i++) { // para mostrar los siguientes dos botones 
        crearBoton(i, null, i === paginaActual);
      }
  
      if (paginaActual < totalPaginas - 3) { // Oara mostrar los ... despues de dos botones (sin contar en el que se esta parado)
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginacion.appendChild(dots);
      }
  
      crearBoton(totalPaginas, null, paginaActual === totalPaginas);
    }
  
    // Botón » siguiente
    if (paginaActual < totalPaginas) { // ⬅️ si se esta en cualquier pagina que no sea la ultima se muestra el »
      crearBoton(paginaActual + 1, '»');
    }
  }
  
// ⬇️ Estoy llamando a la funcion obtenerCultivos, de esta parte todo el codigo
    obtenerCultivos();
// ⬇️Aqui empieza el bloqeu de codigo para buscar⬇️

  const button = document.querySelector(".usuario__search-button");  // ⬅️ Botón de búsqueda
  const input = document.querySelector(".searchInput");  // ⬅️ Input de búsqueda

  if (button && input) {
    // Tomamos el evento de click en el input
    button.addEventListener("click", function() {
      filtrarTabla(input.value); // Esto es para filtrar,
    });

    // Evento de presionar Enter en el input
    input.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        filtrarTabla(input.value);
      }
    });

    // Evento de clic en el input para vaciarlo si tiene valor
    input.addEventListener("click", function() {
      if (input.value) {
        input.value = "";  // Vaciar el campo si tiene algún valor
      }
    });
  } else {
    console.log("No se encontraron los elementos de búsqueda.");
  }

  // Función para filtrar la tabla
  function filtrarTabla(filtro) {
    // Limpiar y convertir a minúsculas
    const palabrasFiltro = filtro.trim().toLowerCase().split(" ");
    const filas = document.querySelectorAll(".usuario__table tbody tr");
  
    filas.forEach((fila) => {
      const textoFila = Array.from(fila.querySelectorAll("td"))
        .map((celda) => celda.textContent.toLowerCase())
        .join(" "); // Unimos todo el contenido de la fila
  
      // Revisamos si TODAS las palabras del filtro están en la fila
      const coincidencia = palabrasFiltro.every((palabra) => textoFila.includes(palabra));
  
      fila.style.display = coincidencia ? "" : "none";
    });
  }
  



});

