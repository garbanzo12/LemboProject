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
            
            const type_sensor = document.querySelector('.cardright__input-form--type'); //✅
            const name_sensor = document.querySelector('.cardright__input-form--name');//✅
            const unit_sensor = document.querySelector('.cardright__input-form--unit-sensor'); //✅
            const time_sensor = document.querySelector('.cardright__input-form--time');//✅
            const unit_time_sensor = document.querySelector('.cardright__input-form--type-sensor');//✅
            const description_sensor = document.querySelector('.cardright__input-form--description');//✅
            const image_sensor = document.querySelector('.cardright__input-form--file'); //✅
            const quantity_sensor = document.querySelector('.cardright__input-form--quantity'); //✅
            const state_sensor = toggleCheckbox ? (toggleCheckbox.checked ? 'habilitado' : 'deshabilitado') : '';
            
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
            
            const datos = new FormData();
            datos.append("type_sensor", type_sensor.value);
            datos.append("name_sensor", name_sensor.value);
            datos.append("unit_sensor", unit_sensor.value);
            datos.append("time_sensor", time_sensor.value);
            datos.append("unit_time_sensor", unit_time_sensor.value);
            datos.append("description_sensor", description_sensor.value);
            datos.append("image_sensor", image_sensor.files[0]); // 👈 importante: image_crop.files[0]
            datos.append("quantity_sensor", quantity_sensor.value);
            datos.append("state_sensor", state_sensor);
            if (validarCampo) {
                try {
                    console.log("Datos en FormData antes de enviar:");
                    for (const [key, value] of datos.entries()) {
                        console.log(key + ':', value);
                    }
                    let respuesta = await fetch("http://localhost:3000/api/sensor", {
                        
                        method: "POST",
                        body: (datos),
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