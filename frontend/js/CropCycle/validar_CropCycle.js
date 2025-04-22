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
            
            const name_cropCycle = document.querySelector('.cardright__input-form--name');
            const description_cycle = document.querySelector('.cardright__input-form--description');
            const period_cycle_start = document.querySelector('.cardright__input-form--date-start');
            const period_cycle_end = document.querySelector('.cardright__input-form--date-end');
            const news_cycle = document.querySelector('.cardright__input-form--news');
            const state_cycle = toggleCheckbox ? (toggleCheckbox.checked ? 'habilitado' : 'deshabilitado') : '';
            
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
                name_cropCycle: name_cropCycle ? name_cropCycle.value : '',
                description_cycle: description_cycle ? description_cycle.value : '',
                period_cycle_start: period_cycle_start ? period_cycle_start.value : '',
                period_cycle_end: period_cycle_end ? period_cycle_end.value : '',
                news_cycle: news_cycle ? news_cycle.value : '',
                state_cycle: state_cycle
            };

            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos);
                    let respuesta = await fetch("http://localhost:5501/cropcycle", {
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

// CSS para el checkbox (puedes ponerlo en tu archivo CSS o en un <style> en el head)
const style = document.createElement('style');
style.textContent = `
    .cardright__input-form--checkbox {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 40px;
        height: 20px;
        border-radius: 10px;
        background-color: var(--checked-color, #4CAF50);
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .cardright__input-form--checkbox::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--thumb-color, white);
        transition: transform 0.3s;
    }
    
    .cardright__input-form--checkbox:checked::after {
        transform: translateX(20px);
    }
    
    .cardright__input-form--checkbox:not(:checked) {
        background-color: var(--unchecked-color, #cccccc);
    }
`;
document.head.appendChild(style);

setTimeout(() => {
    inicializarValidaciones();
}, 100);