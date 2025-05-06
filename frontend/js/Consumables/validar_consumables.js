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
    const type_consumables = document.querySelector('.cardright__input-form--type'); //✅
    const name_consumables = document.querySelector('.cardright__input-form--name');//✅
    const quantity_consumables = document.querySelector('.cardright__input-form--quantity');//✅
    const unit_consumables = document.querySelector('.cardright__input-form--unit-consumables'); //✅
    const unitary_value = document.querySelector('.cardright__input-form--unitary-value');//✅
    const total_value = document.querySelector('.cardright__input-form--total-value');

            function calcularTotal() {
                const precioUnitario = parseFloat(unitary_value.value) || 0;
                const cantidad = parseFloat(quantity_consumables.value) || 0;
                const totalCalculado = precioUnitario * cantidad;
            
                total_value.value = totalCalculado; // Mostrarlo con 2 decimales
                console.log(total_value.value)
            }
            unitary_value.addEventListener('input', calcularTotal);
            quantity_consumables.addEventListener('input', calcularTotal);

    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            
           
            
          
            const description_consumables = document.querySelector('.cardright__input-form--description');//✅

            const state_consumables = toggleCheckbox ? (toggleCheckbox.checked ? 'habilitado' : 'deshabilitado') : '';
            
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
                } else if (input === name_consumables && input.value.trim().length > 20) {
                    validarCampo = false;
                    errorSpan.textContent = "Solo se permiten 20 caracteres.";
                } else if (input === description_consumables && input.value.trim().length > 50) {
                    validarCampo = false;
                    errorSpan.textContent = "Solo se permiten 50 caracteres.";
                } else {
                    errorSpan.textContent = "";
                }
            });
            
            let datos = {
                type_consumables: type_consumables ? type_consumables.value : '',
                name_consumables: name_consumables ? name_consumables.value : '',
                quantity_consumables: quantity_consumables ? quantity_consumables.value : '',
                unit_consumables: unit_consumables ? unit_consumables.value : '',
                unitary_value: unitary_value ? unitary_value.value : '',
                total_value: total_value ? total_value.value : '',
                description_consumables: description_consumables ? description_consumables.value : '',
                state_consumables: state_consumables
            };
           
            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos);
                    let respuesta = await fetch("http://localhost:5501/consumables", {
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