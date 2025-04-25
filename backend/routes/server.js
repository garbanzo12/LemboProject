const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 5501;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Carpeta pública
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importar rutas
app.use(require("./consumables"));
app.use(require("./crops"));
app.use(require("./cropCycle"));
app.use(require("./cuadros"));
app.use(require("./sensors"));
app.use(require("./users"));
app.use(require("./integrador"));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
