document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('.cardright__dinamic-table');
    const paginacion = document.querySelector('.cardright__pagination');
    let paginaActual = 1;
  
    async function obtenerProducciones(pagina = 1, buscar = '') {
        try {
            const res = await fetch(`http://localhost:5501/integrador/listar-produccion?page=${pagina}&buscar=${encodeURIComponent(buscar)}`);
          
          // Verificar si la respuesta es JSON
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await res.text();
            throw new Error(`El servidor respondió con: ${textResponse}`);
          }
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Error HTTP: ${res.status}`);
          }
          
          const data = await res.json();
          
          // Validar estructura de la respuesta
          if (!data.producciones || !Array.isArray(data.producciones)) {
            throw new Error('Formato de respuesta inválido');
          }
          
          mostrarProducciones(data.producciones);
          mostrarPaginacion(data.total, pagina, buscar);
        } catch (err) {
          console.error('Error al obtener producciones:', err);
          
          // Mostrar mensaje de error específico al usuario
          const errorMessage = err.message.includes('Unexpected token')
            ? 'Error en el formato de datos recibidos'
            : err.message;
          
          alert(`Error: ${errorMessage}`);
        }
      }

      function mostrarProducciones(producciones) {
        tbody.innerHTML = '';
      
        producciones.forEach(produccion => {
          const row = document.createElement('tr');
          row.className = 'cardright__row';
      
          // Manejo seguro de valores nulos/undefined
          const safe = (value, fallback = '') => value ?? fallback;
          
          // Convertir arrays a strings
          const usuarios = Array.isArray(produccion.users_selected) 
            ? produccion.users_selected.join(', ') 
            : safe(produccion.users_selected);
          
          const cultivos = Array.isArray(produccion.crops_selected) 
            ? produccion.crops_selected.join(', ') 
            : safe(produccion.crops_selected);
    
          const cantidad = Array.isArray(produccion.quantity_consumables) 
            ? produccion.quantity_consumables.join(', ') 
            : safe(produccion.quantity_consumables);
            
          row.innerHTML = `
            <td class="cardright__cell">${safe(produccion.id)}</td>
            <td class="cardright__cell">${safe(produccion.responsable)}</td>
            <td class="cardright__cell">${usuarios}</td>
            <td class="cardright__cell">${cultivos}</td>
            <td class="cardright__cell">${safe(produccion.name_cropCycle)}</td>
            <td class="cardright__cell">${safe(produccion.name_consumables)}</td>
            <td class="cardright__cell">${safe(produccion.quantity_consumables)}</td>
            <td class="cardright__cell">${safe(produccion.name_sensor)}</td>
            <td class="cardright__cell">${safe(produccion.state_production)}</td>
          `;
          
          tbody.appendChild(row);
        });
    }
      
    function mostrarPaginacion(totalProducciones, paginaActual, buscar = '') {
      const totalPaginas = Math.ceil(totalProducciones / 10);
      paginacion.innerHTML = '';
    
      const crearBoton = (num, texto = null, isActive = false) => {
        const btn = document.createElement('button');
        btn.textContent = texto || num;
        if (isActive) btn.classList.add('activo');
        btn.addEventListener('click', () => obtenerProducciones(num, buscar));
        paginacion.appendChild(btn);
      };
    
      if (paginaActual > 1) {
        crearBoton(paginaActual - 1, '«');
      }
    
      if (totalPaginas <= 7) {
        for (let i = 1; i <= totalPaginas; i++) {
          crearBoton(i, null, i === paginaActual);
        }
      } else {
        crearBoton(1, null, paginaActual === 1);
    
        if (paginaActual > 4) {
          const dots = document.createElement('span');
          dots.textContent = '...';
          paginacion.appendChild(dots);
        }
    
        const start = Math.max(2, paginaActual - 2);
        const end = Math.min(totalPaginas - 1, paginaActual + 2);
    
        for (let i = start; i <= end; i++) {
          crearBoton(i, null, i === paginaActual);
        }
    
        if (paginaActual < totalPaginas - 3) {
          const dots = document.createElement('span');
          dots.textContent = '...';
          paginacion.appendChild(dots);
        }
    
        crearBoton(totalPaginas, null, paginaActual === totalPaginas);
      }
    
      if (paginaActual < totalPaginas) {
        crearBoton(paginaActual + 1, '»');
      }
    }
    
    obtenerProducciones();
  
    // Buscar producciones
    const button = document.querySelector(".cardright__container-buscar");
    const input = document.querySelector(".cardright__container-search");
  
    if (button && input) {
      button.addEventListener("click", function() {
        const filtro = input.value.trim();
        obtenerProducciones(1, filtro);
      });
    
      input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const filtro = input.value.trim();
          obtenerProducciones(1, filtro);
        }
      });
    
      input.addEventListener("click", function() {
        if (input.value) {
          input.value = "";
          obtenerProducciones(1);
        }
      });
    } else {
      console.log("No se encontraron los elementos de búsqueda."); 
    }
  });