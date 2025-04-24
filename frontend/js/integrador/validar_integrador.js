console.log("holas");

// Objeto global para almacenar todos los datos
const produccionData = {
    name_production: '',
    responsable: '',
    users_selected: [],
    crops_selected: [],
    name_cropCycle: [],
    name_consumables: [],
    name_sensor: []
};

// Cargar responsables en el select principal
async function cargarResponsables() {
    try {
        const response = await fetch("http://localhost:5501/users/responsable");
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
        const response = await fetch("http://localhost:5501/users/responsable");
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
    const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    botonEnviarFormulario.addEventListener("click", () => {
        produccionData.users_selected = produccionData.users_selected.filter(
            user => user !== usuarioSeleccionado
        );
        nuevaFila.remove();
    });
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
        const response = await fetch("http://localhost:5501/crops/responsable");
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
    const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    botonEnviarFormulario.addEventListener("click", () => {
        produccionData.crops_selected = produccionData.crops_selected.filter(
            cultivo => cultivo !== cultivoseleccionado
        );
        nuevaFila.remove();
    });
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
        const response = await fetch("http://localhost:5501/cycle/responsable");
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
    const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    botonEnviarFormulario.addEventListener("click", () => {
        produccionData.name_cropCycle = produccionData.name_cropCycle.filter(
            ciclo => ciclo !== cicloseleccionado
        );
        nuevaFila.remove();
    });
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
async function cargarInsumoSelect() {
    try {
        const response = await fetch("http://localhost:5501/consumable/responsable");
        const insumos = await response.json();
        const select = document.querySelector(".integrator__tablet-select--consumable");

        insumos.forEach(insumo => {
            const option = document.createElement("option");
            option.value = insumo.name_consumables;
            option.textContent = insumo.name_consumables;
            select.appendChild(option);
        });

        document.querySelector(".integrator__add-consumable").addEventListener("click", agregarinsumoATabla);
        
    } catch (error) {
        console.error("Error al cargar insumos:", error);
    }
}

// Agregar cultivo a la tabla y al objeto
function agregarinsumoATabla() {
    const select = document.querySelector(".integrator__tablet-select--consumable");
    const insumoseleccionado = select.value.trim();
    
    if (!insumoseleccionado) return;
    
    if (produccionData.name_consumables.some(insumo => 
        insumo.toLowerCase() === insumoseleccionado.toLowerCase()
    )) {
        alert(`El insumo "${insumoseleccionado}" ya está en la lista`);
        select.value = "";
        return;
    }
    
    const tbody = document.querySelector(".integrator_consumable-list");
    const nuevaFila = document.createElement("tr");
    
    const celda = document.createElement("td");
    celda.className = "integrator__table-dato";
    celda.textContent = insumoseleccionado;
    
    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    botonEnviarFormulario.addEventListener("click", () => {
        produccionData.name_consumables = produccionData.name_consumables.filter(
            insumo => insumo !== insumoseleccionado
        );
        nuevaFila.remove();
    });
    botonEliminar.textContent = "×";
    botonEliminar.className = "eliminar-cultivo";
    botonEliminar.addEventListener("click", () => {
        produccionData.name_consumables = produccionData.name_consumables.filter(
            insumo => insumo !== insumoseleccionado
        );
        nuevaFila.remove();
    });
  
    produccionData.name_consumables.push(insumoseleccionado);
    
    celdaEliminar.appendChild(botonEliminar);
    nuevaFila.appendChild(celda);
    nuevaFila.appendChild(celdaEliminar);
    tbody.appendChild(nuevaFila);
    
    select.value = "";
}
// ⬆️ Funciones de insumo ⬆️  


// ⬇️ Funciones de sensores ⬇️
async function cargarSensorSelect() {
    try {
        const response = await fetch("http://localhost:5501/sensors/responsable");
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
    const botonEnviarFormulario = document.querySelector(".integrator__botton-primary--color");
    botonEnviarFormulario.addEventListener("click", () => {
        produccionData.name_sensor = produccionData.name_sensor.filter(
            sensor => sensor !== sensoreseleccionado
        );
        nuevaFila.remove();
    });
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
    try {
        const response = await fetch("http://localhost:5501/productions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produccionData)
        });
        const id = await response.json();

        if (response.ok) {
            const form = document.querySelector(".integrator__form");
            form.reset();
            mostrarMensaje(form,`✅Datos enviados correctamente ID : ${id.id}`,"green");
            produccionData.users_selected = [];
        } else {
            mostrarMensaje(form,"❌Datos enviados incorrectamente","red");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al enviar los datos");
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
    document.querySelector('.integrator__botton-primary--color').addEventListener("click", enviarProduccion);
    setTimeout(() => {
        inicializarValidaciones();
    }, 100);
});