console.log("holas");

// Objeto global para almacenar todos los datos
const produccionData = {
    name_production: '',
    responsable: '',
    users_selected: []
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
    document.querySelector('.integrator__botton-primary--color').addEventListener("click", enviarProduccion);
    setTimeout(() => {
        inicializarValidaciones();
    }, 100);
});