
document.addEventListener("DOMContentLoaded", () => {
const forms = document.querySelectorAll(".cardright__form--top3");
    forms.forEach((form) => {
    
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector('.card__right__input--name')
  const type = document.querySelector('.card__right__input--type')
  const location = document.querySelector('.card__right__input--location')
  const description = document.querySelector('.card__right__input--description')
  const size = document.querySelector('.card__right__input--size').value.trim()
  const image = document.querySelector('.cardright__input-form--file').files[0];


  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
        let errorSpan = input.nextElementSibling;

        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            errorSpan.style.color = "red";
            input.insertAdjacentElement("afterend", errorSpan);
        }

        if (input.value.trim() === "" && input.type !="checkbox") {
            validarCampo = false;
            errorSpan.textContent = "Campo obligatorio.";
        } else {
            errorSpan.textContent = "";
        }
    });
  // Validaciones simples de front (opcionales, express-validator hará el resto)
  if (!name || !type || !location || !description || !size || !image) {
    return;
  }

  if (isNaN(size) || Number(size) <= 0) {
    alert("⚠ El tamaño debe ser un número positivo");
    return;
  }

  // Preparamos el FormData
  const formData = new FormData();
  formData.append('name_crop', name.value.trim());
  formData.append('type_crop', type.value.trim());
  formData.append('location', location.value.trim());
  formData.append('description_crop', description.value.trim());
  formData.append('size_m2', size);
  formData.append('image_crop', image);

  try {
    const respuesta = await fetch("http://localhost:3000/api/crops", {
      method: "POST",
      body: formData
    });

                    let resultado = await respuesta.json();

                    if (respuesta.ok) {
                        form.reset(); // Limpiar formulario tras el envío

                        const mensaje = `✅ Datos guardados correctamente.\nID del registro: ${resultado.cropId}`;
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
                        
                        texto.textContent = `✅ Datos guardados correctamente.\nID del registro: ${resultado.cropId}`;
                        cuadro.style.display = "block";
                    
                        botonCopiar.onclick = () => {
                            navigator.clipboard.writeText(resultado._id)
                                .then(() => {
                                    botonCopiar.textContent = "✅ Copiado";
                                    setTimeout(() => botonCopiar.textContent = "Copiar ID", 2000);
                                    })
                                .catch(() => alert("Error al copiar el ID"));
                        };
                    
                        // También opcionalmente mostrar debajo del formulario
                        mostrarMensaje(form, mensaje, "green");
                        window.parent.postMessage("cerrarModalYActualizar", "*"); // Esto es para cuando el archivo se abre como modal

                    }

                    
                     else {
                        throw new Error(resultado.error || "Error desconocido.");
                    }
                } catch (error) {
                    mostrarMensaje(form, "❌ Error al guardar los datos.", "red");
                }
    });        
});
        
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
})