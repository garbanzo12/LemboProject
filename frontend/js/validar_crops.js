console.log("olahol");

document.addEventListener('DOMContentLoaded', function() {    
// ⬇️ Aqui empieza el Insertar/Crear ⬇️
function inicializarValidaciones() { // 
    
    const forms = document.querySelectorAll(".cardright__form--top3");
    forms.forEach((form) => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // 👈 Asegúrate de que esto esté aquí
            console.log('Funcionando prevent defauklt')
            const name_crop = document.querySelector('.card__right__input--name'); //✅
            const type_crop = document.querySelector('.card__right__input--type');  //✅
            const location = document.querySelector('.card__right__input--location'); //✅
            const description_crop = document.querySelector('.card__right__input--info'); //✅
            const size_m2 = document.querySelector('.card__right__input--size'); //✅
            const image_crop = document.querySelector('.cardright__input-form--file'); //✅
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
            console.log(name_crop.value)
            const datos = new FormData();
            datos.append("name_crop", name_crop.value);
            datos.append("type_crop", type_crop.value);
            datos.append("location", location.value);
            datos.append("description_crop", description_crop.value);
            datos.append("size_m2", size_m2.value);
            datos.append("image_crop", image_crop.files[0]); // 👈 importante: image_crop.files[0]
            if (validarCampo) {
                try {
                    console.log("Datos en FormData antes de enviar:");
                    for (const [key, value] of datos.entries()) {
                        console.log(key + ':', value);
                    }
                    let respuesta = await fetch("http://localhost:5501/crops", {
                        
                        method: "POST",
                        body: (datos),
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
                            window.location.href = "/frontend/views/crops/2-seach_crops.html"; // 👈 Redireccionamiento 
                          });
                        
                        texto.textContent = `✅ Datos guardados correctamente.\nID del registro: ${resultado.id}`;
                        cuadro.style.display = "block";
                    
                        botonCopiar.onclick = () => {
                            navigator.clipboard.writeText(resultado.id)
                                .then(() => {
                                    botonCopiar.textContent = "✅ Copiado";
                                    setTimeout(() => botonCopiar.textContent = "Copiar ID");
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

});
