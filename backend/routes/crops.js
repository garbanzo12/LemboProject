// La conexion con la bd
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configurar conexión a la BD
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "lembo_sgal_db"
});
conexion.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// Ruta para insertar datos
app.post("/crops", (req, res) => {
    console.log("Datos recibidos en POST /crops:", req.body); 

    const { name_crop, type_crop, location, description_crop, size_m2 } = req.body;

    if (!name_crop || !type_crop || !location || !description_crop || !size_m2) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO crops (name_crop, type_crop, location, description_crop, size_m2) VALUES (?, ?, ?, ?, ?)";
    conexion.query(sql, [name_crop, type_crop, location, description_crop, size_m2], (error, resultado) => {
        if (error) {
            console.error("Error al insertar datos:", error);
            return res.status(500).json({ error: "Error al insertar datos" });
        }

        console.log("Resultado del INSERT:", resultado);
        res.json({ 
            mensaje: "Datos guardados correctamente", 
            id: resultado.insertId
        });
    });
});
// 🟡 Ruta para buscar un cultivo por ID
app.get("/crops/:id", (req, res) => {
  const cropId = req.params.id;

  let sql = "SELECT * FROM crops WHERE id = ?";
  conexion.query(sql, [cropId], (error, resultados) => {
      if (error) {
          console.error("Error al buscar cultivo:", error);
          return res.status(500).json({ error: "Error al buscar cultivo" });
      }

      if (resultados.length === 0) {
          return res.status(404).json({ mensaje: "Cultivo no encontrado" });
      }

      res.json(resultados[0]);
  });
});

// ✅ NUEVA RUTA: Obtener todos los cultivos
app.get("/crops", (req, res) => {
  const sql = "SELECT id, name_crop, type_crop, location, size_m2, description_crop FROM crops";
  conexion.query(sql, (error, resultados) => {
      if (error) {
          console.error("Error al obtener cultivos:", error);
          return res.status(500).json({ error: "Error al obtener cultivos" });
      }

      res.json(resultados);
  });
});

// 🟢 Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));





// Ruta para actualizar el cultivo
app.post('/crops/:id', (req, res) => {
  
    const {
      id,
      nombre_cultivo,
      tipo_cultivo,
      ubicacion_cultivo,
      descripcion_cultivo,
      tamano_cultivo,
    } = req.body;
  
    // Consulta SQL para actualizar los datos del cultivo
    const query = `
      UPDATE crops 
      SET 
        name_crop = ?, 
        type_crop = ?, 
        location = ?, 
        description_crop = ?, 
        size_m2 = ?
      WHERE id = ?
    `;
  
    // Ejecutar la consulta
    conexion.query(query, [
      nombre_cultivo,
      tipo_cultivo,
      ubicacion_cultivo,
      descripcion_cultivo,
      tamano_cultivo, 
      id
    ], (err, result) => {
      if (err) {
        console.error('Error al actualizar el cultivo:', err);
        return res.status(500).json({ error: 'Hubo un error al actualizar el cultivo.' });
      }
  
      // Responder con éxito
      res.json({ message: 'Cultivo actualizado exitosamente.' });
    });
  });
  

// Este ess el bloque de listar
  const path = require('path');

app.get('/5-listar-cultivos.html', (req, res) => {
  res.sendFile(path.join(__dirname,'/frontend/views/sgal cultivos/HTML/5-listar-cultivos.html'));

  const query = 'SELECT * FROM crops';

  conexion.query(query, (err, results) => {
    if (err) {    
      console.error('Error al obtener cultivos:', err);
      return res.status(500).send('Error del servidor');
    }
    console.log(results[0]); // <-- Esto te muestra los campos disponibles

    res.json(results); // <-- ENVÍA JSON
  });
});

