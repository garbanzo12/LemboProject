console.log("holas");

// Objeto global para almacenar todos los datos
const produccionData = {
    name_production: '',
    responsable: '',
    users_selected: [],
    crops_selected: [],
    name_cropCycle: [],
    name_consumables: [],
    quantity_consumables : [],
    unitary_value_consumables : [],
    total_value_consumables : '',
    name_sensor: []
};
function limpiarCamposSeleccionados() {
    // Vaciar el objeto global
    produccionData.users_selected = [];
    produccionData.crops_selected = [];
    produccionData.name_cropCycle = [];
    produccionData.name_consumables = [];
    produccionData.quantity_consumables = [];
    produccionData.unitary_value_consumables = [];
    produccionData.total_value_consumables = [];
    produccionData.name_sensor = [];

    // Limpiar todas las tablas visuales
    const tablas = [
        ".integrator_users-list",
        ".integrator_crops-list",
        ".integrator_cycle-list",
        ".integrator_consumable-list",
        ".integrator_sensor-list"
    ];

    tablas.forEach(selector => {
        const tbody = document.querySelector(selector);
        if (tbody) {
            tbody.innerHTML = ""; // 💥 Borra todas las filas
        }
    });
}

// Cargar responsables en el select principal
async function cargarResponsables() {
    try {
        const response = await fetch("http://localhost:5501/integrador/users/responsable");
        const usuarios = await response.json();
        const select = document.querySelector(".integrator__input-form--resp");

        usuarios.forEach(usuario => {
            const option = document.createElement("option");
            option.value = usuario.name_user;
            option.textContent = usuario.name_user;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar responsables:", error);
    }
}

// Cargar usuarios en el select de agregar
async function cargarUsuariosSelect() {
   
    try {
        const response = await fetch("http://localhost:5501/integrador/users/responsable");
        const usuarios = await response.json();
        const select = document.querySelector(".integrator__tablet-select--users");

        usuarios.forEach(usuario => {
            const option = document.createElement("option");
            option.value = usuario.name_user;
            option.textContent = usuario.name_user;
            select.appendChild(option);
        });

        document.querySelector(".integrator__add-user").addEventListener("click", agregarUsuarioATabla);
        
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

// Agregar usuario a la tabla y al objeto
function agregarUsuarioATabla() {
    if (produccionData.users_selected.length >= 3) {
        alert("Solo puedes agregar hasta 3 usuarios.");
        return;
    }
    const select = document.querySelector(".integrator__tablet-select--users");
    const usuarioSeleccionado = select.value.trim();
    
    if (!usuarioSeleccionado) return;
    
    if (produccionData.users_selected.some(user => 
        user.toLowerCase() === usuarioSeleccionado.toLowerCase()
    )) {
        alert(`El usuario "${usuarioSeleccionado}" ya está en la lista`);
        select.value = "";
        return;
    }
    
    const tbody = document.querySelector(".integrator_users-list");
    const nuevaFila = document.createElement("tr");
    
    const celda = document.createElement("td");
    celda.className = "integrator__table-dato";
    celda.textContent = usuarioSeleccionado;
    
    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    // const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    // botonEnviarFormulario.addEventListener("click", () => {
    //     produccionData.users_selected = produccionData.users_selected.filter(
    //         user => user !== usuarioSeleccionado
    //     );
    //     nuevaFila.remove();
    // });
    botonEliminar.textContent = "×";
    botonEliminar.className = "eliminar-usuario";
    botonEliminar.addEventListener("click", () => {
        produccionData.users_selected = produccionData.users_selected.filter(
            user => user !== usuarioSeleccionado
        );
        nuevaFila.remove();
    });
    
    produccionData.users_selected.push(usuarioSeleccionado);
    
    celdaEliminar.appendChild(botonEliminar);
    nuevaFila.appendChild(celda);
    nuevaFila.appendChild(celdaEliminar);
    tbody.appendChild(nuevaFila);
    
    select.value = "";
}
// ⬆️ Funciones de usuario


// ⬇️ Funciones de cultivo⬇️
async function cargarCultivoSelect() {
    try {
        const response = await fetch("http://localhost:5501/integrador/crops/responsable");
        const cultivos = await response.json();
        const select = document.querySelector(".integrator__tablet-select--crops");

        cultivos.forEach(cultivo => {
            const option = document.createElement("option");
            option.value = cultivo.name_crop;
            option.textContent = cultivo.name_crop;
            select.appendChild(option);
        });

        document.querySelector(".integrator__add-crop").addEventListener("click", agregarcultivoATabla);
        
    } catch (error) {
        console.error("Error al cargar cultivos:", error);
    }
}

// Agregar cultivo a la tabla y al objeto
function agregarcultivoATabla() {
    if (produccionData.crops_selected.length >= 3) {
        alert("Solo puedes agregar hasta 3 usuarios.");
        return;
    }
    const select = document.querySelector(".integrator__tablet-select--crops");
    const cultivoseleccionado = select.value.trim();
    
    if (!cultivoseleccionado) return;
    
    if (produccionData.crops_selected.some(cultivo => 
        cultivo.toLowerCase() === cultivoseleccionado.toLowerCase()
    )) {
        alert(`El cultivo "${cultivoseleccionado}" ya está en la lista`);
        select.value = "";
        return;
    }
    
    const tbody = document.querySelector(".integrator_crops-list");
    const nuevaFila = document.createElement("tr");
    
    const celda = document.createElement("td");
    celda.className = "integrator__table-dato";
    celda.textContent = cultivoseleccionado;
    
    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    // const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    // botonEnviarFormulario.addEventListener("click", () => {
    //     produccionData.crops_selected = produccionData.crops_selected.filter(
    //         cultivo => cultivo !== cultivoseleccionado
    //     );
    //     nuevaFila.remove();
    // });
    botonEliminar.textContent = "×";
    botonEliminar.className = "eliminar-cultivo";
    botonEliminar.addEventListener("click", () => {
        produccionData.crops_selected = produccionData.crops_selected.filter(
            cultivo => cultivo !== cultivoseleccionado
        );
        nuevaFila.remove();
    });
    
    produccionData.crops_selected.push(cultivoseleccionado);
    
    celdaEliminar.appendChild(botonEliminar);
    nuevaFila.appendChild(celda);
    nuevaFila.appendChild(celdaEliminar);
    tbody.appendChild(nuevaFila);
    
    select.value = "";
}
// ⬆️ Funciones de cultivo⬆️ 


// ⬇️ Funciones de ciclo ⬇️
async function cargarCicloSelect() {
    try {
        const response = await fetch("http://localhost:5501/integrador/cycle/responsable");
        const ciclos = await response.json();
        const select = document.querySelector(".integrator__tablet-select--cycle");

        ciclos.forEach(ciclo => {
            const option = document.createElement("option");
            option.value = ciclo.name_cropCycle;
            option.textContent = ciclo.name_cropCycle;
            select.appendChild(option);
        });

        document.querySelector(".integrator__add-cycle").addEventListener("click", agregarcicloATabla);
        
    } catch (error) {
        console.error("Error al cargar ciclos:", error);
    }
}

// Agregar cultivo a la tabla y al objeto
function agregarcicloATabla() {
    if (produccionData.name_cropCycle.length >= 3) {
        alert("Solo puedes agregar hasta 3 cultivos.");
        return;
    }
    const select = document.querySelector(".integrator__tablet-select--cycle");
    const cicloseleccionado = select.value.trim();
    
    if (!cicloseleccionado) return;
    
    if (produccionData.name_cropCycle.some(ciclo => 
        ciclo.toLowerCase() === cicloseleccionado.toLowerCase()
    )) {
        alert(`El Ciclo "${cicloseleccionado}" ya está en la lista`);
        select.value = "";
        return;
    }
    
    const tbody = document.querySelector(".integrator_cycle-list");
    const nuevaFila = document.createElement("tr");
    
    const celda = document.createElement("td");
    celda.className = "integrator__table-dato";
    celda.textContent = cicloseleccionado;
    
    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    // const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    // botonEnviarFormulario.addEventListener("click", () => {
    //     produccionData.name_cropCycle = produccionData.name_cropCycle.filter(
    //         ciclo => ciclo !== cicloseleccionado
    //     );
    //     nuevaFila.remove();
    // });
    botonEliminar.textContent = "×";
    botonEliminar.className = "eliminar-cultivo";
    botonEliminar.addEventListener("click", () => {
        produccionData.name_cropCycle = produccionData.name_cropCycle.filter(
            ciclo => ciclo !== cicloseleccionado
        );
        nuevaFila.remove();
    });
    
    produccionData.name_cropCycle.push(cicloseleccionado);
    
    celdaEliminar.appendChild(botonEliminar);
    nuevaFila.appendChild(celda);
    nuevaFila.appendChild(celdaEliminar);
    tbody.appendChild(nuevaFila);
    
    select.value = "";
}
// ⬆️ Funciones de ciclo⬆️ 



// ⬇️ Funciones de insumo ⬇️

let insumosDisponibles = {}; // Guardamos nombre, cantidad y precio aquí

async function cargarInsumoSelect() {
    try {
        const response = await fetch("http://localhost:5501/integrador/consumable/responsable");
        const insumos = await response.json();
        const select = document.querySelector(".integrator__tablet-select--consumable");

        insumos.forEach(insumo => {
            const option = document.createElement("option");
            option.value = insumo.name_consumables;
            option.textContent = `${insumo.name_consumables} (Disponible: ${insumo.quantity_consumables})`;
            select.appendChild(option);

            // Guardamos objeto con cantidad y precio
            insumosDisponibles[insumo.name_consumables] = {
                cantidad: insumo.quantity_consumables,
                precio: insumo.unitary_value
            };
        });

        document.querySelector(".integrator__add-consumable").addEventListener("click", agregarinsumoATabla);

    } catch (error) {
        console.error("Error al cargar insumos:", error);
    }
}

// Mostrar el resumen total de dinero
function actualizarTotalDinero() {
    const filas = document.querySelectorAll(".integrator_consumable-list tr");
    let total = 0;

    filas.forEach(fila => {
        const columnas = fila.querySelectorAll("td");
        if (columnas.length >= 3) {
            const precioTexto = columnas[2].textContent.replace('$', '').trim();
            const precio = parseFloat(precioTexto);
            if (!isNaN(precio)) total += precio;
        }
    });

    let resumen = document.querySelector(".resumen-total-dinero");
    if (!resumen) {
        resumen = document.createElement("div");
        resumen.className = "resumen-total-dinero";
        resumen.style.marginTop = "10px";
        resumen.style.fontWeight = "bold";
        resumen.style.fontSize = "1.2rem";

        const tabla = document.querySelector(".integrator_consumable-list");
        tabla.parentNode.appendChild(resumen);
    }

    resumen.textContent = `💲 Total insumos: $${total.toFixed(2)}`;
    produccionData.total_value_consumables = total;

}

function agregarinsumoATabla() {
    if (produccionData.name_consumables.length >= 3) {
        alert("Solo puedes agregar hasta 3 insumos.");
        return;
    }
    if (produccionData.name_consumables.length >= 3) {
        alert("Solo puedes agregar hasta 3 cultivos.");
        return;
    }
    const select = document.querySelector(".integrator__tablet-select--consumable");
    const insumoseleccionado = select.value.trim();
    
    if (!insumoseleccionado) return;

    const insumoInfo = insumosDisponibles[insumoseleccionado];

    if (!insumoInfo) {
        alert("Insumo no encontrado.");
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

    if (produccionData.name_consumables.some(insumo => 
        insumo.toLowerCase() === insumoseleccionado.toLowerCase()
    )) {
        alert(`El insumo "${insumoseleccionado}" ya está en la lista`);
        select.value = "";
        return;
    }

    // Calcular valor total
    const totalPrecio = insumoInfo.precio * cantidadConsumir;

    // Actualizar stock en memoria
    insumoInfo.cantidad -= cantidadConsumir;

    // Crear fila
    const tbody = document.querySelector(".integrator_consumable-list");
    const nuevaFila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.className = "integrator__table-dato";
    celdaNombre.textContent = insumoseleccionado;

    const celdaCantidad = document.createElement("td");
    celdaCantidad.className = "integrator__table-dato";
    celdaCantidad.textContent = cantidadConsumir;

    const celdaPrecioTotal = document.createElement("td");
    celdaPrecioTotal.className = "integrator__table-dato";
    celdaPrecioTotal.textContent = `$${totalPrecio.toFixed(2)}`;

    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "×";
    botonEliminar.className = "eliminar-cultivo";

    botonEliminar.addEventListener("click", () => {
        // Devolver stock
        insumoInfo.cantidad += cantidadConsumir;

        // Eliminar del objeto global
        const index = produccionData.name_consumables.findIndex(
            insumo => insumo === insumoseleccionado
        );
        if (index !== -1) {
            produccionData.name_consumables.splice(index, 1);
            produccionData.quantity_consumables.splice(index, 1);
        }

        nuevaFila.remove();
        actualizarTotalDinero(); // Actualizar resumen
    });

    celdaEliminar.appendChild(botonEliminar);

    nuevaFila.appendChild(celdaNombre);
    nuevaFila.appendChild(celdaCantidad);
    nuevaFila.appendChild(celdaPrecioTotal);
    nuevaFila.appendChild(celdaEliminar);

    tbody.appendChild(nuevaFila);

    // Agregar a producción
    produccionData.name_consumables.push(insumoseleccionado);
    produccionData.quantity_consumables.push(cantidadConsumir);
    produccionData.unitary_value_consumables.push(totalPrecio);
   

    actualizarTotalDinero();
    select.value = "";
}

// ⬆️ Funciones de insumo ⬆️


// ⬇️ Agregar Insumo ⬇️

async function actualizarStock() {
    try {
        // Crear array de consumo real
        const consumos = [];

        const filas = document.querySelectorAll(".integrator_consumable-list tr");

        filas.forEach(fila => {
            const columnas = fila.querySelectorAll("td");
            if (columnas.length >= 2) {
                const nombre = columnas[0].textContent.trim();
                const cantidad = parseInt(columnas[1].textContent.trim(), 10);

                consumos.push({
                    name_consumables: nombre,
                    cantidadConsumida: cantidad
                    
                });

            }

        });

        console.log(consumos)
        // Hacemos el POST al servidor
        const response = await fetch("http://localhost:5501/integrador/consumable/actualizar-stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ consumos })
        });

        const resultado = await response.json();

        if (response.ok) {
            console.log("✅ Stock actualizado:", resultado);
            return true
        } else {
            console.error("❌ Error en stock:", resultado);
            alert("❌ Error al actualizar stock");
            return false
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error al actualizar stock");
    }
}
// ⬆️ Agregar Insumo ⬆️

// ⬇️ Funciones de sensores ⬇️
async function cargarSensorSelect() {
    try {
        const response = await fetch("http://localhost:5501/integrador/sensors/responsable");
        const sensores = await response.json();
        const select = document.querySelector(".integrator__tablet-select--sensor");

        sensores.forEach(sensor => {
            const option = document.createElement("option");
            option.value = sensor.name_sensor;
            option.textContent = sensor.name_sensor;
            select.appendChild(option);
        });

        document.querySelector(".integrator__add-sensor").addEventListener("click", agregarsensorATabla);
        
    } catch (error) {
        console.error("Error al cargar sensores:", error);
    }
}

// Agregar cultivo a la tabla y al objeto
function agregarsensorATabla() {
    if (produccionData.name_sensor.length >= 3) {
        alert("Solo puedes agregar hasta 3 sensores.");
        return;
    }
    const select = document.querySelector(".integrator__tablet-select--sensor");
    const sensoreseleccionado = select.value.trim();
    
    if (!sensoreseleccionado) return;
    
    if (produccionData.name_sensor.some(sensor => 
        sensor.toLowerCase() === sensoreseleccionado.toLowerCase()
    )) {
        alert(`El sensor "${sensoreseleccionado}" ya está en la lista`);
        select.value = "";
        return;
    }
    
    const tbody = document.querySelector(".integrator_sensor-list");
    const nuevaFila = document.createElement("tr");
    
    const celda = document.createElement("td");
    celda.className = "integrator__table-dato";
    celda.textContent = sensoreseleccionado;
    
    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    // const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    // botonEnviarFormulario.addEventListener("click", () => {
    //     produccionData.name_sensor = produccionData.name_sensor.filter(
    //         sensor => sensor !== sensoreseleccionado
    //     );
    //     nuevaFila.remove();
    // });
    botonEliminar.textContent = "×";
    botonEliminar.className = "eliminar-cultivo";
    botonEliminar.addEventListener("click", () => {
        produccionData.name_sensor = produccionData.name_sensor.filter(
            sensor => sensor !== sensoreseleccionado
        );
        nuevaFila.remove();
    });
    
    produccionData.name_sensor.push(sensoreseleccionado);
    
    celdaEliminar.appendChild(botonEliminar);
    nuevaFila.appendChild(celda);
    nuevaFila.appendChild(celdaEliminar);
    tbody.appendChild(nuevaFila);
    
    select.value = "";
}
// ⬆️ Funciones de sensores ⬆️  
// Función para enviar los datos al servidor
async function enviarProduccion() {
    produccionData.name_production = document.querySelector('.integrator__input-form--n-prodution').value;
    produccionData.responsable = document.querySelector('.integrator__input-form--resp').value;
    console.log(produccionData)
    const form = document.querySelector(".integrator__form");

    try {
        const response = await fetch("http://localhost:5501/integrador/productions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produccionData)
        });
        const id = await response.json();

        if (response.ok) {
            form.reset();
            mostrarMensaje(form, `✅Datos enviados correctamente ID : ${id.id}`, "green");
            produccionData.users_selected = [];
            const resumen = document.querySelector(".resumen-total-dinero");
            if (resumen) {
                resumen.textContent = "💲 Total insumos: $0.00";
            }
            return true; // ✅ Producción guardada exitosamente

        }else {
            if (id.error === "Ya existe una producción con ese nombre") {
                mostrarMensaje(form, "❌Nombre de producción ya registrado", "red");
            } else if (produccionData.name_production.trim() === "") {
                mostrarMensaje(form, "❌Verifica que el nombre de la producción esté rellenado", "red");
            } else {
                mostrarMensaje(form, "❌Error al guardar los datos", "red");
            }
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarMensaje(form, "❌Datos enviados incorrectamente", "red");
        return false; // ❌ Error de conexión o servidor
    }
}


// Validaciones del formulario
function inicializarValidaciones() {
    const forms = document.querySelectorAll(".integrator__form");
  
    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const name_production = document.querySelector('.integrator__input-form--n-prodution');
            const responsable = document.querySelector(".integrator__input-form--resp");
            
            let validarCampo = true;

            if (name_production) {
                let errorSpan = name_production.nextElementSibling;
            
                if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                    errorSpan = document.createElement("span");
                    errorSpan.classList.add("error-message");
                    errorSpan.style.color = "red";
                    name_production.insertAdjacentElement("afterend", errorSpan);
                }
            
                if (name_production.value.trim() === "") {
                    errorSpan.textContent = "Campo obligatorio.";
                    validarCampo = false;
                } else if (name_production.value.trim().length < 3) {
                    errorSpan.textContent = "Mínimo 3 caracteres.";
                    validarCampo = false;
                } else if (name_production.value.trim().length > 100) {
                    errorSpan.textContent = "Maximo 100 caracteres.";
                    validarCampo = false;
                } else {
                    errorSpan.textContent = "";
                }
            }
            
          
        });
    });
}

// Mostrar mensajes de estado
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

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarResponsables();
    cargarUsuariosSelect();
    cargarCultivoSelect()
    cargarCicloSelect()
    cargarInsumoSelect()
    cargarSensorSelect()
    
    document.querySelector('.integrator__botton-primary--color').addEventListener("click", async () => {
        const produccionGuardada = await enviarProduccion();  // 👈 Guarda producción
    
        if (produccionGuardada) {
            const stockActualizado = await actualizarStock(); // 👈 Luego actualizar stock
            
            if (stockActualizado) {
                limpiarCamposSeleccionados(); // 👈 Solo aquí limpiamos
            }
        }
    });
    
    setTimeout(() => {
        inicializarValidaciones();
    }, 100);
});





//⬇️ Dezpliegue de modales

document.addEventListener("DOMContentLoaded", () => {
    const btnsCrearItem = document.querySelectorAll(".integrator__module .integrator__botton-primary--modal");
  
    btnsCrearItem.forEach((btn) => {
      btn.addEventListener("click", () => {
        const modulo = btn.closest(".integrator__module");
        const header = modulo.querySelector(".integrator__module-header")?.textContent?.trim()?.toUpperCase();
  
        const rutas = {
          "INSUMOS": "/frontend/views/insumes/1-create_insumes.html",
          "USUARIOS": "/frontend/views/users/1-create_user.html",
          "CULTIVOS": "/frontend/views/crops/1-create_crops.html",
          "CICLOS": "/frontend/views/cycle_crops/1-create_cycle_crops.html",
          "SENSORES": "/frontend/views/sensors/1-create_sensor.html"
        };
  
        if (rutas[header]) {
          const modal = document.getElementById("modal-global");
          const iframe = document.getElementById("iframe-global");
          iframe.src = rutas[header];
          modal.style.display = "flex";
        }
      });
    });
  
    // Al cerrar modal con la X
    const cerrarModal = document.querySelector(".modal__close");
    cerrarModal.addEventListener("click", () => {
      document.getElementById("modal-global").style.display = "none";
      location.reload(); // Recarga la página al cerrar
    });
  
      
    // Al hacer clic fuera del contenido del modal
    window.addEventListener("click", (e) => {
      const modal = document.getElementById("modal-global");
      if (e.target === modal) {
        modal.style.display = "none";
        location.reload(); // También recarga si se cierra haciendo clic afuera
      }
    });
  
    // Escuchar desde iframe si quiere cerrar modal y refrescar
    window.addEventListener("message", (e) => {
      if (e.data === "cerrarModalYActualizar") {
        document.getElementById("modal-global").style.display = "none";
        location.reload();
      }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const modal = document.getElementById("modal-global");
          if (modal.style.display === "flex") {
            modal.style.display = "none";
            location.reload(); // 🔄 Refresca la página al cerrar con ESC
          }
        }
      });
  });
  