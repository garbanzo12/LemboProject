const express = require("express");
const app = express();
const cors = require("cors");

// Habilita CORS si frontend y backend están en puertos distintos
app.use(cors());

// Servir archivos estáticos (como index.html, etc.)
app.use(express.static("public"));

// Ruta para enviar todos los cultivos (simulando una BD)
const cultivos = [
  { id: "001", nombre: "Papa", ubicacion: "Cundinamarca" },
  { id: "002", nombre: "Yuca", ubicacion: "Meta" },
  { id: "003", nombre: "Maíz", ubicacion: "Tolima" },
];

// Endpoint para obtener todos los cultivos
app.get("/crops", (req, res) => {
  res.json(cultivos);
});

// También podrías hacer búsqueda directa por ID:
app.get("/crops/:id", (req, res) => {
  const cultivo = cultivos.find(c => c.id === req.params.id);
  if (cultivo) {
    res.json(cultivo);
  } else {
    res.status(404).json({ error: "Cultivo no encontrado" });
  }
});

const PORT = 5501;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
