console.log("hola");

function inicializarValidaciones() {
    const forms = document.querySelectorAll(".form");

    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const select_typeUser = document.querySelector('.ciclo__user');
            const select_typeID = document.querySelector('.ciclo__document');
            const ciclo__nameUser = document.querySelector('.ciclo__nameUser');
            const ciclo__email = document.querySelector('.ciclo__email');
            const ciclo__cellPhone = document.querySelector('.ciclo__cellPhone');
            let validarCampo = true;
            const inputs = form.querySelectorAll("input");

           
        
           

            let textoSeleccionado_user = select_typeUser.options[select_typeUser.selectedIndex].text;
            let textoSeleccionado_typeID = select_typeID.options[select_typeID.selectedIndex].text;
           

          
            console.log(textoSeleccionado_user)
            console.log(textoSeleccionado_typeID)



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
                type_user: textoSeleccionado_user ,
                type_ID: textoSeleccionado_typeID,
                name_user: ciclo__nameUser ? ciclo__nameUser.value : '',
                email: ciclo__email ? ciclo__email.value : '',
                contact: ciclo__cellPhone ? ciclo__cellPhone.value : ''
            }; // Objeto para almacenar los valores del formulario
            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos); // Agrega esto antes del fetch(
                    let respuesta = await fetch("http://localhost:5501/users", {
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
