
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
    let insumosDisponibles = {};
    let insumosConsumidos = {};

    // Función para limpiar todos los campos
    const limpiarCampos = () => {
        inputNombre.value = "";
        selectResponsable.value = "";
        tbodyUsers.innerHTML = "";
        tbodyCrops.innerHTML = "";
        tbodyCycle.innerHTML = "";
        tbodyInsumos.innerHTML = "";
        tbodySensores.innerHTML = "";
        resumen.textContent = "💲 Total insumos: $0.00";
        selectUsers.value = "";
        selectCrops.value = "";
        selectCycle.value = "";
        selectConsumable.value = "";
        selectSensor.value = "";
        choices.setChoices([], 'value', 'label', true);
        cargarIds();
        produccionCargada = null;
        insumosConsumidos = {};
    };

    // Inicializar Choices
    const choices = new Choices(selectId, {
        searchPlaceholderValue: "Buscar producción...",
        itemSelectText: "",
    });

    // Cargar opciones de producción
   const cargarIds = async () => {
    const res = await fetch("http://localhost:3000/api/production/getIdsproduction");
    const data = await res.json();

    // Adaptar al formato que espera choices.js
    choices.setChoices(
        data.map(p => ({ value: p.id, label: p.id })), 
        'value', 
        'label', 
        true
    );
};

    // Cargar responsables
    const cargarResponsables = async () => {
        const res = await fetch("http://localhost:3000/api/production/getIdsresponsable");
        const data = await res.json();
        selectResponsable.innerHTML = "";
        data.forEach(user => {
            const opt = document.createElement("option");
            opt.value = user.name_user;
            opt.textContent = user.name_user;
            selectResponsable.appendChild(opt);
        });
    };

    // Cargar usuarios para el select de agregar
    const cargarUsuariosSelect = async () => {
        const res = await fetch("http://localhost:3000/api/production/getIdsresponsable");
        const data = await res.json();
        selectUsers.innerHTML = "";
        data.forEach(user => {
            const opt = document.createElement("option");
            opt.value = user.name_user;
            opt.textContent = user.name_user;
            selectUsers.appendChild(opt);
        });
    };

    // Cargar cultivos para el select de agregar
    const cargarCultivoSelect = async () => {
        const res = await fetch("http://localhost:3000/api/production/getIdcrops");
        const data = await res.json();
        selectCrops.innerHTML = "";
        data.forEach(crop => {
            const opt = document.createElement("option");
            opt.value = crop.name_crop;
            opt.textContent = crop.name_crop;
            selectCrops.appendChild(opt);
        });
    };

    // Cargar ciclos para el select de agregar
    const cargarCicloSelect = async () => {
        const res = await fetch("http://localhost:3000/api/production/getIdcycle");
        const data = await res.json();
        selectCycle.innerHTML = "";
        data.forEach(cycle => {
            const opt = document.createElement("option");
            opt.value = cycle.cropCycles;
            opt.textContent = cycle.cropCycles;
            selectCycle.appendChild(opt);
        });
    };

    // Cargar insumos para el select de agregar
    const cargarInsumoSelect = async () => {
        const res = await fetch("http://localhost:3000/api/production/getIdconsumable");
        const data = await res.json();
        selectConsumable.innerHTML = "";
        
        data.forEach(insumo => {
            const opt = document.createElement("option");
            opt.value = insumo.name_consumables;
            opt.textContent = `${insumo.name_consumables} (Disponible: ${insumo.quantity_consumables})`;
            selectConsumable.appendChild(opt);

            insumosDisponibles[insumo.name_consumables] = {
                cantidad: insumo.quantity_consumables,
                precio: insumo.unitary_value
            };
        });
    };

    // Cargar sensores para el select de agregar
    const cargarSensorSelect = async () => {
        const res = await fetch("http://localhost:3000/api/production/getIdsensor");
        const data = await res.json();
        selectSensor.innerHTML = "";
        data.forEach(sensor => {
            const opt = document.createElement("option");
            opt.value = sensor.name_sensor;
            opt.textContent = sensor.name_sensor;
            selectSensor.appendChild(opt);
        });
    };

  

    // Función para devolver insumo
    const devolverInsumo = async (nombre, cantidad) => {
        try {
            const response = await fetch("http://localhost:3000/api/production/devolverstock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name_consumables: nombre, 
                    cantidadDevuelta: cantidad 
                })
            });
            return response.ok;
        } catch (error) {
            console.error("Error al devolver insumo:", error);
            return false;
        }
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
            
            const celdaEliminar = document.createElement("td");
            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.textContent = "×";
            botonEliminar.className = "eliminar-item";
            botonEliminar.addEventListener("click", () => {
                tr.remove();
                actualizarTotalDinero();
            });
            celdaEliminar.appendChild(botonEliminar);
            tr.appendChild(celdaEliminar);
            
            tbody.appendChild(tr);
        });
    };

    // Rellenar tabla de insumos
    const rellenarInsumos = (nombres, cantidades, precios, tbody) => {
        tbody.innerHTML = "";
        let total = 0;

        for (let i = 0; i < nombres.length; i++) {
            const tr = document.createElement("tr");

            const tdNombre = document.createElement("td");
            tdNombre.className = "integrator__table-dato";
            tdNombre.textContent = nombres[i];

            const tdCantidad = document.createElement("td");
            tdCantidad.className = "integrator__table-dato";
            tdCantidad.textContent = cantidades[i];

            const tdPrecio = document.createElement("td");
            tdPrecio.className = "integrator__table-dato";
            const precio = parseFloat(precios[i] || 0);
            total += precio;
            tdPrecio.textContent = `$${precio.toFixed(2)}`;

            const tdEliminar = document.createElement("td");
            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.textContent = "×";
            btnEliminar.className = "eliminar-item";
            btnEliminar.addEventListener("click", async () => {
                if (confirm(`¿Devolver ${cantidades[i]} unidades de ${nombres[i]} al inventario?`)) {
                    const exito = await devolverInsumo(nombres[i], cantidades[i]);
                    if (exito) {
                        tr.remove();
                        actualizarTotalDinero();
                    } else {
                        alert("Error al devolver el insumo al inventario");
                    }
                }
            });
            tdEliminar.appendChild(btnEliminar);

            tr.appendChild(tdNombre);
            tr.appendChild(tdCantidad);
            tr.appendChild(tdPrecio);
            tr.appendChild(tdEliminar);
            
            tbody.appendChild(tr);
            insumosConsumidos[nombres[i]] = {
                cantidad: cantidades[i],
                precio: precios[i]
            };
        }

        resumen.textContent = `💲 Total insumos: $${total.toFixed(2)}`;
    };

    // Actualizar total de dinero
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

        const existe = Array.from(tbodyUsers.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === usuarioSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El usuario "${usuarioSeleccionado}" ya está en la lista`);
            selectUsers.value = "";
            return;
        }

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = usuarioSeleccionado;
        tr.appendChild(td);
        
        const celdaEliminar = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "×";
        botonEliminar.className = "eliminar-item";
        botonEliminar.addEventListener("click", () => {
            tr.remove();
        });
        celdaEliminar.appendChild(botonEliminar);
        tr.appendChild(celdaEliminar);
        
        tbodyUsers.appendChild(tr);
        selectUsers.value = "";
    };

    // Función para agregar un nuevo cultivo
    const agregarCultivoATabla = () => {
        const cultivoSeleccionado = selectCrops.value.trim();
        if (!cultivoSeleccionado) return;

        const existe = Array.from(tbodyCrops.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === cultivoSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El cultivo "${cultivoSeleccionado}" ya está en la lista`);
            selectCrops.value = "";
            return;
        }

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = cultivoSeleccionado;
        tr.appendChild(td);
        
        const celdaEliminar = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "×";
        botonEliminar.className = "eliminar-item";
        botonEliminar.addEventListener("click", () => {
            tr.remove();
        });
        celdaEliminar.appendChild(botonEliminar);
        tr.appendChild(celdaEliminar);
        
        tbodyCrops.appendChild(tr);
        selectCrops.value = "";
    };

    // Función para agregar un nuevo ciclo
    const agregarCicloATabla = () => {
        const cicloSeleccionado = selectCycle.value.trim();
        if (!cicloSeleccionado) return;

        const existe = Array.from(tbodyCycle.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === cicloSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El ciclo "${cicloSeleccionado}" ya está en la lista`);
            selectCycle.value = "";
            return;
        }

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = cicloSeleccionado;
        tr.appendChild(td);
        
        const celdaEliminar = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "×";
        botonEliminar.className = "eliminar-item";
        botonEliminar.addEventListener("click", () => {
            tr.remove();
        });
        celdaEliminar.appendChild(botonEliminar);
        tr.appendChild(celdaEliminar);
        
        tbodyCycle.appendChild(tr);
        selectCycle.value = "";
    };

    // Función para agregar un nuevo sensor
    const agregarSensorATabla = () => {
        const sensorSeleccionado = selectSensor.value.trim();
        if (!sensorSeleccionado) return;

        const existe = Array.from(tbodySensores.querySelectorAll("td")).some(
            td => td.textContent.toLowerCase() === sensorSeleccionado.toLowerCase()
        );

        if (existe) {
            alert(`El sensor "${sensorSeleccionado}" ya está en la lista`);
            selectSensor.value = "";
            return;
        }

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.className = "integrator__table-dato";
        td.textContent = sensorSeleccionado;
        tr.appendChild(td);
        
        const celdaEliminar = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "×";
        botonEliminar.className = "eliminar-item";
        botonEliminar.addEventListener("click", () => {
            tr.remove();
        });
        celdaEliminar.appendChild(botonEliminar);
        tr.appendChild(celdaEliminar);
        
        tbodySensores.appendChild(tr);
        selectSensor.value = "";
    };

    // Función para agregar un nuevo insumo
  // Modificar la función agregarinsumoATabla
// Función para agregar un nuevo insumo (actualizada)
const agregarinsumoATabla = () => {
    const insumoseleccionado = selectConsumable.value.trim();
    if (!insumoseleccionado) return;

    const insumoInfo = insumosDisponibles[insumoseleccionado];
    if (!insumoInfo) {
        alert("Insumo no encontrado.");
        return;
    }

    // Verificar si ya hay 3 insumos
    const filasInsumos = tbodyInsumos.querySelectorAll("tr");
    if (filasInsumos.length >= 3) {
        alert("Solo puedes agregar hasta 3 insumos.");
        return;
    }

    // Verificar si el insumo ya está en la lista
    const existe = Array.from(tbodyInsumos.querySelectorAll("td:first-child")).some(
        td => td.textContent.toLowerCase() === insumoseleccionado.toLowerCase()
    );
    if (existe) {
        alert(`El insumo "${insumoseleccionado}" ya está en la lista`);
        selectConsumable.value = "";
        return;
    }

    // Pedir cantidad
    const cantidadDeseada = prompt(`¿Cuántas unidades deseas consumir de ${insumoseleccionado}?`);
    const cantidadConsumir = parseInt(cantidadDeseada, 10);

    if (isNaN(cantidadConsumir) || cantidadConsumir <= 0) {
        alert("Por favor ingresa un número válido mayor que 0.");
        return;
    }

    if (cantidadConsumir > insumoInfo.cantidad) {
        alert(`No puedes consumir más de ${insumoInfo.cantidad} unidades.`);
        return;
    }

    // Calcular valor total
    const totalPrecio = insumoInfo.precio * cantidadConsumir;

    // Crear fila en la tabla
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.className = "integrator__table-dato";
    tdNombre.textContent = insumoseleccionado;

    const tdCantidad = document.createElement("td");
    tdCantidad.className = "integrator__table-dato";
    tdCantidad.textContent = cantidadConsumir;

    const tdPrecio = document.createElement("td");
    tdPrecio.className = "integrator__table-dato";
    tdPrecio.textContent = `$${totalPrecio.toFixed(2)}`;

    const tdEliminar = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "×";
    btnEliminar.className = "eliminar-item";
    btnEliminar.addEventListener("click", async () => {
        if (confirm(`¿Devolver ${cantidadConsumir} unidades de ${insumoseleccionado} al inventario?`)) {
            const exito = await devolverInsumo(insumoseleccionado, cantidadConsumir);
            if (exito) {
                tr.remove();
                actualizarTotalDinero();
            } else {
                alert("Error al devolver el insumo al inventario");
            }
        }
    });
    tdEliminar.appendChild(btnEliminar);

    tr.appendChild(tdNombre);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdEliminar);
    
    tbodyInsumos.appendChild(tr);
    selectConsumable.value = "";
    
    // Actualizar el total
    actualizarTotalDinero();
};

// Modificar la función actualizarStock para que realmente reste
const actualizarStock = async () => {
    const insumoFilas = tbodyInsumos.querySelectorAll("tr");
    const consumos = [];
    
    insumoFilas.forEach(fila => {
        const tds = fila.querySelectorAll("td");
        if (tds.length >= 3) {
            consumos.push({
                name_consumables: tds[0].textContent,
                cantidadConsumida: parseInt(tds[1].textContent)
            });
        }
    });

    try {
        const response = await fetch("http://localhost:3000/api/production/actualizarstock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ consumos })
        });

        if (!response.ok) {
            throw new Error("Error al actualizar stock");
        }
        return true;
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error al actualizar stock");
        return false;
    }
};

    
    let estadoProduccion = ''; // valor por defecto
    // Obtener datos de la producción seleccionada
    const checkbox = document.querySelector('.cardright__input-form--checkbox');
const label = document.querySelector('.cardright__label-form--color');

// Al cargar, agregamos clase "inicial"
label.classList.add('inicial');

// Cuando se interactúa, quitamos la clase "inicial"
checkbox.addEventListener('change', () => {
    label.classList.remove('inicial');
});
    selectId.addEventListener("change", async () => {
        const id = selectId.value;
        const res = await fetch(`http://localhost:3000/api/production/loadproduction/${id}`);
        const data = await res.json();

        produccionCargada = data;

        inputNombre.value = data.name_production || "";
        selectResponsable.value = data.responsable || "";

        rellenarLista(data.users_selected, tbodyUsers);
        rellenarLista(data.crops_selected, tbodyCrops);
        rellenarLista(data.cropCycles, tbodyCycle);
        rellenarLista(data.name_sensor, tbodySensores);
        rellenarInsumos(data.consumables, data.quantity_consumables, data.unitary_value_consumables, tbodyInsumos);
         // Inicializar checkbox según el valor actual
    const toggleCheckbox = document.getElementById('toggle-color');
    toggleCheckbox.checked = data.state_production === 'deshabilitado';
    estadoProduccion = data.state_production;

    toggleCheckbox.addEventListener('change', () => {
        estadoProduccion = toggleCheckbox.checked ? 'deshabilitado' : 'habilitado';
        console.log('Estado cambiado:', estadoProduccion);
    });
});

   
    // Enviar cambios
    form.addEventListener("submit", async e => {
        e.preventDefault();

        if (!produccionCargada) return alert("Selecciona una producción.");
        let state = (estadoProduccion == 1) ? "deshabilitado" : "habilitado";

            
        
        const payload = {
            name_production: inputNombre.value.trim(),
            responsable: selectResponsable.value.trim(),
            users_selected: Array.from(tbodyUsers.querySelectorAll("td:first-child")).map(td => td.textContent),
            crops_selected: Array.from(tbodyCrops.querySelectorAll("td:first-child")).map(td => td.textContent),
            cropCycles: Array.from(tbodyCycle.querySelectorAll("td:first-child")).map(td => td.textContent),
            name_sensor: Array.from(tbodySensores.querySelectorAll("td:first-child")).map(td => td.textContent),
            consumables: [],
            quantity_consumables: [],
            unitary_value_consumables: [],
            total_value_consumables: 0,
            
            state_production : state 
            
        };

        const insumoFilas = tbodyInsumos.querySelectorAll("tr");
        let total = 0;
        insumoFilas.forEach(fila => {
            const tds = fila.querySelectorAll("td");
            if (tds.length >= 3) {
                const nombre = tds[0].textContent;
                const cantidad = tds[1].textContent;
                const valor = parseFloat(tds[2].textContent.replace('$', '')) || 0;

                payload.consumables.push(nombre);
                payload.quantity_consumables.push(cantidad);
                payload.unitary_value_consumables.push(valor);
                total += valor;
            }
        });

        payload.total_value_consumables = total;
        
        try {
            console.log("Payload enviado:", payload);
            const res = await fetch(`http://localhost:3000/api/production/putproduction/${selectId.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                mostrarMensaje(form,"✅ Producción actualizada correctamente.","green");
            } else {
                const error = await res.json();
                alert("❌ Error: " + (error.message || "desconocido"));
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("❌ Error de conexión al intentar actualizar");
        }
    });

    // Event listeners para botones de agregar
    btnAddUser?.addEventListener("click", agregarUsuarioATabla);
    btnAddCrop?.addEventListener("click", agregarCultivoATabla);
    btnAddCycle?.addEventListener("click", agregarCicloATabla);
    btnAddConsumable?.addEventListener("click", agregarinsumoATabla);
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

function mostrarMensaje(form, mensaje, color) {
    let mensajeSpan = form.querySelector(".cardright__foot-form");
    
    if (!mensajeSpan) {
        mensajeSpan = document.createElement("span");
        mensajeSpan.classList.add("cardright__foot-form");
        mensajeSpan.style.display = "block";
        mensajeSpan.style.marginTop = "10px";
        mensajeSpan.style.fontWeight = "bold";
        form.appendChild(mensajeSpan);
    }

    mensajeSpan.textContent = mensaje;
    mensajeSpan.style.color = color;
}
