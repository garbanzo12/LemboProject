document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('.cardright__dinamic-table');
  const paginacion = document.querySelector('.cardright__pagination');
  let paginaActual = 1;

  async function obtenerProducciones(pagina = 1, buscar = '') {
    try {
  const res = await fetch(`http://localhost:3000/api/production/listproduction?page=${pagina}&buscar=${encodeURIComponent(buscar)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (!data.producciones || !Array.isArray(data.producciones)) {
        throw new Error('Formato de respuesta inválido');
      }

      mostrarProducciones(data.producciones);
      mostrarPaginacion(data.total, pagina, buscar);
    } catch (err) {
      console.error('Error al obtener producciones:', err);
      alert(`Error: ${err.message}`);
    }
  }

  function mostrarProducciones(producciones) {
    tbody.innerHTML = '';

    producciones.forEach(produccion => {
      const row = document.createElement('tr');
      row.className = 'cardright__row';

      const safe = (value, fallback = '') => value ?? fallback;

      const usuarios = Array.isArray(produccion.users_selected)
        ? produccion.users_selected.join(', ')
        : safe(produccion.users_selected);

      const cultivos = Array.isArray(produccion.crops_selected)
        ? produccion.crops_selected.join(', ')
        : safe(produccion.crops_selected);

      const consumiblesNombre = Array.isArray(produccion.name_consumables)
        ? produccion.name_consumables.join(', ')
        : safe(produccion.name_consumables);

      const consumiblesCantidad = Array.isArray(produccion.quantity_consumables)
        ? produccion.quantity_consumables.join(', ')
        : safe(produccion.quantity_consumables);

      const sensores = Array.isArray(produccion.name_sensor)
        ? produccion.name_sensor.join(', ')
        : safe(produccion.name_sensor);

      row.innerHTML = `
        <td class="cardright__cell">${safe(produccion.productId || produccion._id)}</td>
        <td class="cardright__cell">${safe(produccion.responsable)}</td>
        <td class="cardright__cell">${usuarios}</td>
        <td class="cardright__cell">${cultivos}</td>
        <td class="cardright__cell">${safe(produccion.cropCycles)}</td>
        <td class="cardright__cell">${consumiblesNombre}</td>
        <td class="cardright__cell">${consumiblesCantidad}</td>
        <td class="cardright__cell">${sensores}</td>
        <td class="cardright__cell">${safe(produccion.state_production)}</td>
      `;

      row.style.cursor = 'pointer';

      row.addEventListener('click', () => {
        localStorage.setItem('ProduccionSeleccionada', JSON.stringify(produccion));
        window.location.href = '/frontend/views/integrator/visualizarIntegrador.html';
      });

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

    if (paginaActual > 1) crearBoton(paginaActual - 1, '«');

    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) crearBoton(i, null, i === paginaActual);
    } else {
      crearBoton(1, null, paginaActual === 1);
      if (paginaActual > 4) paginacion.appendChild(document.createElement('span')).textContent = '...';
      const start = Math.max(2, paginaActual - 2);
      const end = Math.min(totalPaginas - 1, paginaActual + 2);
      for (let i = start; i <= end; i++) crearBoton(i, null, i === paginaActual);
      if (paginaActual < totalPaginas - 3) paginacion.appendChild(document.createElement('span')).textContent = '...';
      crearBoton(totalPaginas, null, paginaActual === totalPaginas);
    }

    if (paginaActual < totalPaginas) crearBoton(paginaActual + 1, '»');
  }

  obtenerProducciones();

  const button = document.querySelector(".cardright__container-buscar");
  const input = document.querySelector(".cardright__container-search");

  if (button && input) {
    button.addEventListener("click", () => obtenerProducciones(1, input.value.trim()));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") obtenerProducciones(1, input.value.trim());
    });
    input.addEventListener("click", () => {
      if (input.value) {
        input.value = "";
        obtenerProducciones(1);
      }
    });
  } else {
    console.log("No se encontraron los elementos de búsqueda."); 
  }
});
