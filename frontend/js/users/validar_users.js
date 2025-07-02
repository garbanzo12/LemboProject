console.log("hola");
function inicializarValidaciones() {
    const forms = document.querySelectorAll(".cardright__form--top3");

    // Configurar el checkbox
    const toggleCheckbox = document.getElementById('toggle-color');
    if (toggleCheckbox) {
        // Estilos iniciales
        toggleCheckbox.style.appearance = 'none';
        toggleCheckbox.style.width = window.innerWidth > 768 ? '20rem' : '20rem';
        toggleCheckbox.style.marginLeft = window.innerWidth > 768 ? '-7rem' :  '1rem';
        toggleCheckbox.style.height = '2rem';
        toggleCheckbox.style.borderRadius = '1rem';
        toggleCheckbox.style.backgroundColor = '#4CAF50';
        toggleCheckbox.style.position = 'relative';
        toggleCheckbox.style.cursor = 'pointer';
        toggleCheckbox.style.transition = 'background-color 0.3s';
        toggleCheckbox.style.setProperty('--thumb-color', '#ffffff');
        toggleCheckbox.style.setProperty('--unchecked-color', '#cccccc');
        toggleCheckbox.style.setProperty('--checked-color', '#4CAF50');
     
        
        
        toggleCheckbox.addEventListener('change', function() {
            this.style.backgroundColor = this.checked ? 'var(--checked-color)' : 'var(--unchecked-color)';
        });
    }
  
    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const type_user = document.querySelector('.cardright__input-form--type-user'); //✅
            const type_ID = document.querySelector('.cardright__input-form--type-document');//✅
            const num_document_identity = document.querySelector('.cardright__input-form--document');//✅
            const name_user = document.querySelector('.cardright__input-form--name');//✅
            const email = document.querySelector('.cardright__input-form--email');//✅
            const cellphone = document.querySelector('.cardright__input-form--cellphone');//✅
            const password = document.querySelector('.cardright__input-form--password');//✅
            const state_user = toggleCheckbox ? (toggleCheckbox.checked ? 'habilitado' : 'deshabilitado') : '';
            
            let validarCampo = true;
            const inputs = form.querySelectorAll("input");

            inputs.forEach((input) => {
                let errorSpan = input.nextElementSibling;

                if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                    errorSpan = document.createElement("span");
                    errorSpan.classList.add("error-message");
                    errorSpan.style.color = "red";
                    input.insertAdjacentElement("afterend", errorSpan);
                }

                if (input.value.trim() === "" && input.type !== "checkbox") {
                    validarCampo = false;
                    errorSpan.textContent = "Campo obligatorio.";
                } else {
                    errorSpan.textContent = "";
                }
            });
            
            let datos = {
                type_user: type_user ? type_user.value : '',
                type_ID: type_ID ? type_ID.value : '',
                num_document_identity: num_document_identity ? num_document_identity.value : '',
                name_user: name_user ? name_user.value : '',
                email: email ? email.value : '',
                cellphone: cellphone ? cellphone.value : '',
                password: password ? password.value : '',
                state_user: state_user
            };

            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos);
                    let respuesta = await fetch("http://localhost:3000/api/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(datos),
                    });

                    let resultado = await respuesta.json();
              
                    if (respuesta.ok) {
                        form.reset();
                        // Restablecer el estado del checkbox después del reset
                        if (toggleCheckbox) {
                            toggleCheckbox.checked = true;
                            toggleCheckbox.style.backgroundColor = 'var(--checked-color)';
                        }
                        mostrarMensaje(form, "✅ Datos guardados correctamente.", "green");
                        window.parent.postMessage("cerrarModalYActualizar", "*"); // Esto es para cuando el archivo se abre como modal
                            
                   } else {
                     
                     // Verificamos si hay errores de validación del backend
                     if (resultado.errors && Array.isArray(resultado.errors)) {
                         const mensajes = resultado.errors.map(e => `⚠️ ${emsg}`).join('\n');
                         mostrarMensaje(form, mensajes, "red");
                     } else {
                         throw new Error(resultado.message || "Errordesconocido.");
                     }}
                } catch (error) {
                    mostrarMensaje(form, "❌ " + error.message, "red");
                }
            }
        });
    });
}

// Función para mostrar mensajes debajo del formulario
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

setTimeout(() => {
    inicializarValidaciones();
}, 100);