console.log("olahol");


// ⬇️ Aqui empieza el Insertar/Crear ⬇️
function inicializarValidaciones() {
    const forms = document.querySelectorAll(".form");

    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const name_crop = document.querySelector('.ciclo__name_crop');
            const type_crop = document.querySelector('.ciclo__type_crop');
            const location = document.querySelector('.ciclo__location');
            const description_crop = document.querySelector('.ciclo__description_crop');
            const size_m2 = document.querySelector('.ciclo__size_m2');
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
                        
                        const mensaje = `✅ Datos guardados correctamente.\nID del registro: ${resultado.id}`;
                        console.log("Respuesta completa del servidor:", resultado);
                    
                        // Mostrar el mensaje en el cuadro arriba
                        const cuadro = document.getElementById("cuadro-mensaje");
                        const texto = document.getElementById("texto-mensaje");
                        const botonCopiar = document.getElementById("copiar-id");
                    

                        // Cerrar modal
                        document.getElementById("cerrar-modal").addEventListener("click", function () {
                            document.getElementById("cuadro-mensaje").style.display = "none";
                          });
                        // Ir a siguiente página
                        document.getElementById("continuar-btn").addEventListener("click", function () {
                            window.location.href = "/frontend/views/sgal cultivos/HTML/2-buscar-cultivo.html"; // Cambia esto a la ruta que necesites
                          });
                        
                        texto.textContent = `✅ Datos guardados correctamente.\nID del registro: ${resultado.id}`;
                        cuadro.style.display = "block";
                    
                        botonCopiar.onclick = () => {
                            navigator.clipboard.writeText(resultado.id)
                                .then(() => {
                                    botonCopiar.textContent = "✅ Copiado";
                                    setTimeout(() => botonCopiar.textContent = "Copiar ID", 2000);
                                })
                                .catch(() => alert("Error al copiar el ID"));
                        };
                    
                        // También opcionalmente mostrar debajo del formulario
                        mostrarMensaje(form, mensaje, "green");
                    }

                    
                     else {
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


// ⬆️ Aqui Termina el Insertar/Crear ⬆️


// ⬇️ Aqui empieza el Buscar ⬇️
function IniciarBuscar(){

    const buscar = document.querySelectorAll(".buscar");
    buscar.forEach((busqueda)=>{


        busqueda.addEventListener("submit", function (e) {
            e.preventDefault();
            const idCultivo = document.querySelector('.ciclo__ID'.value);
         
            fetch(`http://localhost:5501/crops/id.${idCultivo}`)
            .then(res => res.json())
            .then(data => {
              console.log("Cultivos recibidos:", data);
              // Aquí puedes buscar por ID si quieres
            })
            .catch(err => {
              console.error("Error al leer los datos:", err);
            });
          });
          

  
            })
    
    

}

setTimeout(() => {
    IniciarBuscar();
}, 100);