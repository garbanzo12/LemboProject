document.addEventListener("DOMContentLoaded", async () => {
    const selectId = document.getElementById("select-id-production");
    const inputNombre = document.querySelector(".integrator__input-form--n-prodution");
    const selectResponsable = document.querySelector(".integrator__input-form--resp");
    const form = document.querySelector(".integrator__form");

    const tbodyUsers = document.querySelector(".integrator_users-list");
    const tbodyCrops = document.querySelector(".integrator_crops-list");
    const tbodyCycle = document.querySelector(".integrator_cycle-list");
    const tbodyInsumos = document.querySelector(".integrator_consumable-list");
    const tbodySensores = document.querySelector(".integrator_sensor-list");

    const resumen = document.querySelector(".resumen-total-dinero");

    // Selects para agregar nuevos elementos
    const selectUsers = document.querySelector(".integrator__tablet-select--users");
    const selectCrops = document.querySelector(".integrator__tablet-select--crops");
    const selectCycle = document.querySelector(".integrator__tablet-select--cycle");
    const selectConsumable = document.querySelector(".integrator__tablet-select--consumable");
    const selectSensor = document.querySelector(".integrator__tablet-select--sensor");

    // Botones para agregar nuevos elementos
    const btnAddUser = document.querySelector(".integrator__add-user");
    const btnAddCrop = document.querySelector(".integrator__add-crop");
    const btnAddCycle = document.querySelector(".integrator__add-cycle");
    const btnAddConsumable = document.querySelector(".integrator__add-consumable");
    const btnAddSensor = document.querySelector(".integrator__add-sensor");

    let produccionCargada = null;
    let insumosDisponibles = {}; // Para almacenar información de insumos

    // Inicializar Choices
    const choices = new Choices(selectId, {
        searchPlaceholderValue: "Buscar producción...",
        itemSelectText: "",
    });

    // Cargar opciones de producción
    const cargarIds = async () => {
        const res = await fetch("http://localhost:5501/integrador/productions/ids");
        const data = await res.json();
        choices.setChoices(data.map(p => ({ value: p.id, label: p.id })), 'value', 'label', true);
    };

    // Cargar responsables
    const cargarResponsables = async () => {
        const res = await fetch("http://localhost:5501/integrador/users/responsable");
        const data = await res.json();
        selectResponsable.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(user => {
            const opt = document.createElement("option");
            opt.value = user.name_user;
            opt.textContent = user.name_user;
            selectResponsable.appendChild(opt);
        });
    };

    // Cargar usuarios para el select de agregar
    const cargarUsuariosSelect = async () => {
        const res = await fetch("http://localhost:5501/integrador/users/responsable");
        const data = await res.json();
        selectUsers.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(user => {
            const opt = document.createElement("option");
            opt.value = user.name_user;
            opt.textContent = user.name_user;
            selectUsers.appendChild(opt);
        });
    };

    // Cargar cultivos para el select de agregar
    const cargarCultivoSelect = async () => {
        const res = await fetch("http://localhost:5501/integrador/crops/responsable");
        const data = await res.json();
        selectCrops.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(crop => {
            const opt = document.createElement("option");
            opt.value = crop.name_crop;
            opt.textContent = crop.name_crop;
            selectCrops.appendChild(opt);
        });
    };

    // Cargar ciclos para el select de agregar
    const cargarCicloSelect = async () => {
        const res = await fetch("http://localhost:5501/integrador/cycle/responsable");
        const data = await res.json();
        selectCycle.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(cycle => {
            const opt = document.createElement("option");
            opt.value = cycle.name_cropCycle;
            opt.textContent = cycle.name_cropCycle;
            selectCycle.appendChild(opt);
        });
    };

    // Cargar insumos para el select de agregar
    const cargarInsumoSelect = async () => {
        const res = await fetch("http://localhost:5501/integrador/consumable/responsable");
        const data = await res.json();
        selectConsumable.innerHTML = ""; // Limpiar opciones existentes
        
        data.forEach(insumo => {
            const opt = document.createElement("option");
            opt.value = insumo.name_consumables;
            opt.textContent = `${insumo.name_consumables} (Disponible: ${insumo.quantity_consumables})`;
            selectConsumable.appendChild(opt);

            // Guardar información de insumos
            insumosDisponibles[insumo.name_consumables] = {
                cantidad: insumo.quantity_consumables,
                precio: insumo.unitary_value
            };
        });
    };

    // Cargar sensores para el select de agregar
    const cargarSensorSelect = async () => {
        const res = await fetch("http://localhost:5501/integrador/sensors/responsable");
        const data = await res.json();
        selectSensor.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(sensor => {
            const opt = document.createElement("option");
            opt.value = sensor.name_sensor;
            opt.textContent = sensor.name_sensor;
            selectSensor.appendChild(opt);
        });
    };

    // Función para agregar botón de eliminar a una fila
    const agregarBotonEliminar = (fila, lista, texto) => {
        const celdaEliminar = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "×";
        botonEliminar.className = "eliminar-item";
        botonEliminar.addEventListener("click", () => {
            lista = lista.filter(item => item !== texto);
            fila.remove();
            actualizarTotalDinero(); // Actualizar total si es la tabla de insumos
        });
        celdaEliminar.appendChild(botonEliminar);
        fila.appendChild(celdaEliminar);
    };

    // Rellenar tablas con botones de eliminar
    const rellenarLista = (lista, tbody) => {
        tbody.innerHTML = "";
        lista.forEach(texto => {
            const tr = document.createElement("tr");
            
            const td = document.createElement("td");
            td.className = "integrator__table-dato";
            td.textContent = texto;
            tr.appendChild(td);
            
            agregarBotonEliminar(tr, lista, texto);
            tbody.appendChild(tr);
        });
    };

    // Rellenar tabla de insumos con botones de eliminar
    const rellenarInsumos = (nombres, cantidades, precios, tbody) => {
        tbody.innerHTML = "";
        let total = 0;

        for (let i = 0; i < nombres.length; i++) {
            const tr = document.createElement("tr");

            const tdNombre = document.createElement("td");
            tdNombre.textContent = nombres[i];

            const tdCantidad = document.createElement("td");
            tdCantidad.textContent = cantidades[i];

            const tdPrecio = document.createElement("td");
            const precio = parseFloat(precios[i] || 0);
            total += precio;
            tdPrecio.textContent = `$${precio.toFixed(2)}`;

            tr.appendChild(tdNombre);
            tr.appendChild(tdCantidad);
            tr.appendChild(tdPrecio);
            
            agregarBotonEliminar(tr, nombres, nombres[i]);
            tbody.appendChild(tr);
        }

        resumen.textContent = `💲 Total insumos: $${total.toFixed(2)}`;
    };

    // Actualizar total de dinero para insumos
    const actualizarTotalDinero = () => {
        const filas = tbodyInsumos.querySelectorAll("tr");
        let total = 0;

        filas.forEach(fila => {
            const columnas = fila.querySelectorAll("td");
            if (columnas.length >= 3) {
                const precioTexto = columnas[2].textContent.replace('$', '').trim();
                const precio = parseFloat(precioTexto);
                if (!isNaN(precio)) total += precio;
            }
        });

        resumen.textContent = `💲 Total insumos: $${total.toFixed(2)}`;
    };

    // Función para agregar un nuevo usuario
    const agregarUsuarioATabla = () => {
        const usuarioSeleccionado = selectUsers.value.trim();
        if (!usuarioSeleccionado) return;

        // Verificar si ya existe
        const existe = Array.from(tbodyUsers.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === usuarioSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El usuario "${usuarioSeleccionado}" ya está en la lista`);
            selectUsers.value = "";
            return;
        }

        // Crear nueva fila
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = usuarioSeleccionado;
        tr.appendChild(td);
        
        agregarBotonEliminar(tr, [], usuarioSeleccionado);
        tbodyUsers.appendChild(tr);
        
        selectUsers.value = "";
    };

    // Función para agregar un nuevo cultivo
    const agregarCultivoATabla = () => {
        const cultivoSeleccionado = selectCrops.value.trim();
        if (!cultivoSeleccionado) return;

        // Verificar si ya existe
        const existe = Array.from(tbodyCrops.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === cultivoSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El cultivo "${cultivoSeleccionado}" ya está en la lista`);
            selectCrops.value = "";
            return;
        }

        // Crear nueva fila
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = cultivoSeleccionado;
        tr.appendChild(td);
        
        agregarBotonEliminar(tr, [], cultivoSeleccionado);
        tbodyCrops.appendChild(tr);
        
        selectCrops.value = "";
    };

    // Función para agregar un nuevo ciclo
    const agregarCicloATabla = () => {
        const cicloSeleccionado = selectCycle.value.trim();
        if (!cicloSeleccionado) return;

        // Verificar si ya existe
        const existe = Array.from(tbodyCycle.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === cicloSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El ciclo "${cicloSeleccionado}" ya está en la lista`);
            selectCycle.value = "";
            return;
        }

        // Crear nueva fila
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = cicloSeleccionado;
        tr.appendChild(td);
        
        agregarBotonEliminar(tr, [], cicloSeleccionado);
        tbodyCycle.appendChild(tr);
        
        selectCycle.value = "";
    };

    // Función para agregar un nuevo sensor
    const agregarSensorATabla = () => {
        const sensorSeleccionado = selectSensor.value.trim();
        if (!sensorSeleccionado) return;

        // Verificar si ya existe
        const existe = Array.from(tbodySensores.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === sensorSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El sensor "${sensorSeleccionado}" ya está en la lista`);
            selectSensor.value = "";
            return;
        }

        // Crear nueva fila
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = sensorSeleccionado;
        tr.appendChild(td);
        
        agregarBotonEliminar(tr, [], sensorSeleccionado);
        tbodySensores.appendChild(tr);
        
        selectSensor.value = "";
    };

    // Función para agregar un nuevo insumo
    const agregarInsumoATabla = () => {
        const insumoSeleccionado = selectConsumable.value.trim();
        if (!insumoSeleccionado) return;

        const insumoInfo = insumosDisponibles[insumoSeleccionado];
        if (!insumoInfo) {
            alert("Insumo no encontrado.");
            return;
        }

        // Pedir cantidad
        const cantidadDeseada = prompt(`¿Cuántas unidades deseas consumir de ${insumoSeleccionado}?`);
        const cantidadConsumir = parseInt(cantidadDeseada, 10);

        if (isNaN(cantidadConsumir)) {
            alert("Por favor ingresa un número válido.");
            return;
        }

        if (cantidadConsumir <= 0) {
            alert("La cantidad debe ser mayor que 0.");
            return;
        }

        if (cantidadConsumir > insumoInfo.cantidad) {
            alert(`No puedes consumir más de ${insumoInfo.cantidad} unidades.`);
            return;
        }

        // Verificar si ya existe
        const existe = Array.from(tbodyInsumos.querySelectorAll("tr")).some(tr => {
            const tds = tr.querySelectorAll("td");
            return tds.length > 0 && tds[0].textContent.toLowerCase() === insumoSeleccionado.toLowerCase();
        });

        if (existe) {
            alert(`El insumo "${insumoSeleccionado}" ya está en la lista`);
            selectConsumable.value = "";
            return;
        }

        // Calcular valor total
        const totalPrecio = insumoInfo.precio * cantidadConsumir;

        // Crear fila
        const tr = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.className = "integrator__table-dato";
        tdNombre.textContent = insumoSeleccionado;

        const tdCantidad = document.createElement("td");
        tdCantidad.className = "integrator__table-dato";
        tdCantidad.textContent = cantidadConsumir;

        const tdPrecioTotal = document.createElement("td");
        tdPrecioTotal.className = "integrator__table-dato";
        tdPrecioTotal.textContent = `$${totalPrecio.toFixed(2)}`;

        tr.appendChild(tdNombre);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdPrecioTotal);
        
        agregarBotonEliminar(tr, [], insumoSeleccionado);
        tbodyInsumos.appendChild(tr);

        actualizarTotalDinero();
        selectConsumable.value = "";
    };

    // Obtener datos de la producción seleccionada
    selectId.addEventListener("change", async () => {
        const id = selectId.value;
        const res = await fetch(`http://localhost:5501/integrador/productions/${id}`);
        const data = await res.json();

        produccionCargada = data;

        inputNombre.value = data.name_production || "";
        selectResponsable.value = data.responsable || "";

        rellenarLista(data.users_selected, tbodyUsers);
        rellenarLista(data.crops_selected, tbodyCrops);
        rellenarLista(data.name_cropCycle, tbodyCycle);
        rellenarLista(data.name_sensor, tbodySensores);
        rellenarInsumos(data.name_consumables, data.quantity_consumables, data.unitary_value_consumables, tbodyInsumos);
    });

    // Enviar cambios
    form.addEventListener("submit", async e => {
        e.preventDefault();

        if (!produccionCargada) return alert("Selecciona una producción.");

        const payload = {
            name_production: inputNombre.value.trim(),
            responsable: selectResponsable.value.trim(),
            users_selected: Array.from(tbodyUsers.querySelectorAll("td:first-child")).map(td => td.textContent),
            crops_selected: Array.from(tbodyCrops.querySelectorAll("td:first-child")).map(td => td.textContent),
            name_cropCycle: Array.from(tbodyCycle.querySelectorAll("td:first-child")).map(td => td.textContent),
            name_sensor: Array.from(tbodySensores.querySelectorAll("td:first-child")).map(td => td.textContent),
            name_consumables: [],
            quantity_consumables: [],
            unitary_value_consumables: [],
            total_value_consumables: 0,
        };

        const insumoFilas = tbodyInsumos.querySelectorAll("tr");
        let total = 0;
        insumoFilas.forEach(fila => {
            const tds = fila.querySelectorAll("td");
            if (tds.length >= 3) {
                const nombre = tds[0].textContent;
                const cantidad = tds[1].textContent;
                const valor = parseFloat(tds[2].textContent.replace('$', '')) || 0;

                payload.name_consumables.push(nombre);
                payload.quantity_consumables.push(cantidad);
                payload.unitary_value_consumables.push(valor);
                total += valor;
            }
        });

        payload.total_value_consumables = total;

        const res = await fetch(`http://localhost:5501/integrador/productions/${produccionCargada.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("✅ Producción actualizada.");
        } else {
            const error = await res.json();
            alert("❌ Error: " + (error.message || "desconocido"));
        }
    });

    // Event listeners para botones de agregar
    btnAddUser?.addEventListener("click", agregarUsuarioATabla);
    btnAddCrop?.addEventListener("click", agregarCultivoATabla);
    btnAddCycle?.addEventListener("click", agregarCicloATabla);
    btnAddConsumable?.addEventListener("click", agregarInsumoATabla);
    btnAddSensor?.addEventListener("click", agregarSensorATabla);

    // Cargar todos los datos iniciales
    await cargarIds();
    await cargarResponsables();
    await cargarUsuariosSelect();
    await cargarCultivoSelect();
    await cargarCicloSelect();
    await cargarInsumoSelect();
    await cargarSensorSelect();
});