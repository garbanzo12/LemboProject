document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".cardright__form");
  const inputs = form.querySelectorAll("input, select");

  // Modal elements
  const modal = document.getElementById("cuadro-mensaje");
  const mensajeP = document.getElementById("texto-mensaje");
  const cerrarModalBtn = document.getElementById("cerrar-modal");
  const copiarIdBtn = document.getElementById("copiar-id");
  const continuarBtn = document.getElementById("continuar-btn");

  // Error message container
  const errorContainer = form.querySelector(".cardright__foot-form p");

  // Function to show messages in the form footer
  const mostrarMensaje = (mensaje, color) => {
    if (errorContainer) {
      errorContainer.textContent = mensaje;
      errorContainer.style.color = color;
    }
  };

  // Function to show the success modal
  const mostrarModalExito = (id) => {
    mensajeP.textContent = `✅ Cultivo creado con éxito. ID: ${id}`;
    modal.style.display = "flex";

    copiarIdBtn.onclick = () => {
      navigator.clipboard.writeText(id).then(() => {
        alert("ID copiado al portapapeles");
      });
    };

    continuarBtn.onclick = () => {
      modal.style.display = "none";
      form.reset();
      mostrarMensaje(".", "black"); // Limpiar mensaje de error
    };

    cerrarModalBtn.onclick = () => {
      modal.style.display = "none";
      form.reset();
      mostrarMensaje(".", "black");
    };
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validar campos
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim() && input.type !== 'file') {
            isValid = false;
        }
    });

    if (!isValid) {
        mostrarMensaje("❌ Todos los campos son obligatorios.", "red");
        return;
    }

    const formData = new FormData();
    formData.append("name_crop", inputs[0].value);
    formData.append("type_crop", inputs[1].value);
    formData.append("location", inputs[2].value);
    formData.append("description_crop", inputs[3].value);
    formData.append("size_m2", inputs[4].value);
    
    const imageFile = inputs[5].files[0];
    if (imageFile) {
      formData.append("image_crop", imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/crops", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        mostrarModalExito(result.cropId);
      } else {
        // Manejo de errores específicos del backend
        if (result.error && result.error.includes("Ya existe un cultivo con este nombre")) {
            mostrarMensaje("❌ Ya existe un cultivo con ese nombre.", "red");
        } else if (result.errors) {
            // Errores de validación
            const errorMessages = result.errors.map(err => err.msg).join(' ');
            mostrarMensaje(`❌ Error de validación: ${errorMessages}`, "red");
        }
        else {
            mostrarMensaje(result.message || "❌ Error al crear el cultivo.", "red");
        }
      }
    } catch (error) {
      console.error("Error de red:", error);
      mostrarMensaje("❌ Error de conexión con el servidor.", "red");
    }
  });
});