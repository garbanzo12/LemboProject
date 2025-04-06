console.log("olahol"); // ⬅️ Este es un mensaje para verificar las conexiones a js


// ⬇️ Aqui empieza el Insertar/Crear ⬇️
function inicializarValidaciones() {
    const forms = document.querySelectorAll(".form"); // ⬅️ Tomo la clase form del formulario 

    forms.forEach((form) => { // ⬅️ Aqui estoy haciendo un forEach para recorrer todos los inputs
        form.addEventListener("submit", async function (event) {
            event.preventDefault();// ⬅️ HAgo un preventDefault para pausar las propiedades predefinidas por el submit
            
            // ⬇️ Estas clases se estan tomando de cada input segun su clase, no para validarlas, sino para almacenarlas en un objeto⬇️
            const name_crop = document.querySelector('.ciclo__name_crop');
            const type_crop = document.querySelector('.ciclo__type_crop');
            const location = document.querySelector('.ciclo__location');
            const description_crop = document.querySelector('.ciclo__description_crop');
            const size_m2 = document.querySelector('.ciclo__size_m2');
            // ⬆️ Estas clases se estan tomando de cada input segun su clase, no para validarlas, sino para almacenarlas en un objeto⬆️

            let validarCampo = true;
            const inputs = form.querySelectorAll("input"); // ⬅️Cada input en HTML tiene esta clase, para que asi recorra todos


            inputs.forEach((input) => { //  ⬅️ Aqui esta el forEach para validar los inputs
                let errorSpan = input.nextElementSibling;
                //  ⬇️ Aqui se estan asignado las propiedades de estilo a los errores ⬇️
                if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                    errorSpan = document.createElement("span");
                    errorSpan.classList.add("error-message");
                    errorSpan.style.color = "red";
                    input.insertAdjacentElement("afterend", errorSpan);
                }
                //  ⬆️ Aqui se estan asignado las propiedades de estilo a los errores ⬆️

                //  ⬇️ Aqui se estan validando los inputs por si estan vacios ⬇️
                if (input.value.trim() === "") {
                    validarCampo = false;
                    errorSpan.textContent = "El campo es obligatorio.";
                } else {
                    errorSpan.textContent = "";
                }
                // ⬆️ Aqui se estan validando los inputs por si estan vacios ⬆️
            });


             //  ⬇️ Aqui se estan guardando los datos de los inputs de la linea 13 a 17 ⬇️
            let datos = {
                name_crop: name_crop ? name_crop.value : '',
                type_crop: type_crop ? type_crop.value : '',
                location: location ? location.value : '',
                description_crop: description_crop ? description_crop.value : '',
                size_m2: size_m2 ? size_m2.value : ''
            }; // ⬅️ Este es el Objeto(datos) para almacenar los valores del formulario
            //  ⬆️ Aqui se estan guardando los datos de los inputs de la linea 13 a 17 ⬆️

            if (validarCampo) {
                try {
                    console.log("Datos enviados:", datos); // ⬅️ Este es un mensaje de validacion para verificar que los datos se hayan mandado bien
                    let respuesta = await fetch("http://localhost:5501/crops", {  // ⬅️ Promesa que busca la tabla crops
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(datos),  // ⬅️ Mando en un JSON el objeto datos, con toda la informacion de los inputs
                    });

                    let resultado = await respuesta.json(); // ⬅️ Aqui llega la respuesta 

                    if (respuesta.ok) { // ⬅️ Si la respuesta esta bien entonces:
                        form.reset(); // ⬅️ Aqui se hace la accion de limpiar formulario tras el envío
                        
                        const mensaje = `✅ Datos guardados correctamente.\nID del registro: ${resultado.id}`; // ⬅️ Aqui muestro el ID asignado a la tabla, para que el usuario pueda buscar la tabla con este(ID)
                        console.log("Respuesta completa del servidor:", resultado); //⬅️ Este es un mensaje de validacion para verificar que los datos se hayan mandado bien
                    
                        //⬇️ Aqui se estan haciendo las propiedades del modal(mensaje)  del cuadro que sale arriba al mandar el formulario⬇️
                        const cuadro = document.getElementById("cuadro-mensaje");
                        const texto = document.getElementById("texto-mensaje");
                        const botonCopiar = document.getElementById("copiar-id");
                        //⬆️ Aqui se estan haciendo las propiedades del modal(mensaje)  del cuadro que sale arriba al mandar el formulario⬆️

                        //⬇️ Esto es para cerrar el modal, aparece una ❌ arribal a la derecha para Cerrar modal ⬇️
                        document.getElementById("cerrar-modal").addEventListener("click", function () {
                            document.getElementById("cuadro-mensaje").style.display = "none";
                          });
                         //⬆️ Esto es para cerrar el modal, aparece una ❌ arribal a la derecha para Cerrar modal ⬆️


                        // ⬇️Esto es para continuar o Ir a siguiente página⬇️
                        document.getElementById("continuar-btn").addEventListener("click", function () {
                            window.location.href = "/frontend/views/sgal cultivos/HTML/2-buscar-cultivo.html"; // Cambia esto a la ruta que necesites
                          });
                        
                        // ⬆️Esto es para continuar o Ir a siguiente página⬆️


                        // ⬇️Este es el contenido del modal⬇️
                        texto.textContent = `✅ Datos guardados correctamente.\nID del registro: ${resultado.id}`;

                        // ⬆️Este es el contenido del modal⬆️
                        cuadro.style.display = "block";


                     // ⬇️Este es un boton de copiar para el ID⬇️
                        botonCopiar.onclick = () => {
                            navigator.clipboard.writeText(resultado.id)
                                .then(() => {
                                    botonCopiar.textContent = "✅ Copiado";
                                    setTimeout(() => botonCopiar.textContent = "Copiar ID", 2000);
                                })
                                .catch(() => alert("Error al copiar el ID"));
                        };
                    // ⬆️Este es un boton de copiar para el ID⬆️

                        
                        mostrarMensaje(form, mensaje, "green"); // ⬅️ Aqui se llama a la funcion de mostrarMensaje
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

//⬇️ Esta es una Función para mostrar mensajes debajo del formulario⬇️ 
function mostrarMensaje(form, mensaje, color) {
    const baseFormDiv = document.querySelector(".baseform");
    if (!baseFormDiv) return;

    let mensajeSpan = baseFormDiv.querySelector(".mensaje-formulario");

    if (!mensajeSpan) {
        mensajeSpan = document.createElement("span");
        mensajeSpan.classList.add("mensaje-formulario");
        mensajeSpan.style.display = "block";
        mensajeSpan.style.marginTop = "0px";
        mensajeSpan.style.fontWeight = "bold";
        baseFormDiv.appendChild(mensajeSpan);
    }

    mensajeSpan.textContent = mensaje;
    mensajeSpan.style.color = color;
}

setTimeout(() => {
    inicializarValidaciones();
}, 100);
//⬆️ Esta es una Función para mostrar mensajes debajo del formulario⬆️ 

// ⬆️ Aqui Termina el Insertar/Crear ⬆️


// ⬇️ Aqui empieza el Buscar ⬇️
//❌ IMPORTANTE : EL BUSCAR NO ESTA TERMINADO ❌
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