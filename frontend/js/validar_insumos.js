console.log("olahol");

function inicializarValidaciones() {
    const forms = document.querySelectorAll(".form");

    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const name_crop = document.querySelector('name_crop');
            const type_crop = document.querySelector('type_crop');
            const location = document.querySelector('location');
            const description_crop = document.querySelector('description_crop');
            const size_m2 = document.querySelector('.size_m2');
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

                if (input.value.trim() === "") {
                    validarCampo = false;
                    errorSpan.textContent = "El campo es obligatorio.";
                } else {
                    errorSpan.textContent = "";


                }

            });
            let datos = {
                name_crop: name_crop ? name_crop.value : '',
                type_crop: type_crop ? type_crop.value : '',
                location: location ? location.value : '',
                description_crop: description_crop ? description_crop.value : '',
                size_m2: size_m2 ? size_m2.value : ''
            }; // Objeto para almacenar los valores del formulario
            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos); // Agrega esto antes del fetch(
                    let respuesta = await fetch("http://localhost:5501/crops", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(datos),
                    });

                    let resultado = await respuesta.json();

                    if (respuesta.ok) {
                        form.reset(); // Limpiar formulario tras el envío
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
    let mensajeSpan = form.querySelector(".mensaje-formulario");
    
    if (!mensajeSpan) {
        mensajeSpan = document.createElement("span");
        mensajeSpan.classList.add("mensaje-formulario");
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
