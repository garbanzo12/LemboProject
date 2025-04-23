console.log("holas");
function inicializarValidaciones() {
    const forms = document.querySelectorAll(".integrator__form");

  
    forms.forEach((form) => {

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const name_production = document.querySelector('.integrator__input-form--n-prodution');
  
         
            
            let validarCampo = true;

            if (name_production) {
                let errorSpan = name_production.nextElementSibling;
            
                // Crear el span si no existe
                if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                    errorSpan = document.createElement("span");
                    errorSpan.classList.add("error-message");
                    errorSpan.style.color = "red";
                    name_production.insertAdjacentElement("afterend", errorSpan);
                }
            
                // Validar contenido
                if (name_production.value.trim() === "") {
                    errorSpan.textContent = "Campo obligatorio.";
                    validarCampo = false;

                } else if (name_production.value.trim().length < 3) {
                    errorSpan.textContent = "Mínimo 3 caracteres.";
                    validarCampo = false;

                }else if (name_production.value.trim().length > 100) {
                    errorSpan.textContent = "Maximo 100 caracteres.";
                    validarCampo = false;
                }
                 else {
                    errorSpan.textContent = ""; // Limpiar si todo está bien
                }
            }
            
          
            let datos = {
                name_production: name_production ? name_production.value : ''
              
            };

            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos);
                    let respuesta = await fetch("http://localhost:5501/productions", {
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
                    } else {
                        throw new Error(resultado.error || "Error desconocido.");
                    }
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


