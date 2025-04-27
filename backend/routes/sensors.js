function sensors(){

  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const mysql = require("mysql2");
  const multer = require("multer");
  const path = require("path");
  const router = express.Router(); // Cambiado: app → router
  
  router.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  router.use(express.urlencoded({ extended: true }));
  router.use('/uploads', express.static('uploads'));
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  conexion.connect((err) => {
    if (err) throw err;
    console.log("Conectado a MySQL [Sensor]");
  });
 
  
  router.post("/sensors", upload.single("image_sensor"), (req, res) => {
    console.log("Datos recibidos en POST /sensors:", req.body);
  
    const { type_sensor, name_sensor, unit_sensor, time_sensor, description_sensor, state_sensor } = req.body;
    const image_sensor = req.file ? req.file.filename : null;
  
    if (!type_sensor || !name_sensor || !unit_sensor || !time_sensor || !description_sensor || !image_sensor || !state_sensor) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    const sql = "INSERT INTO sensors (type_sensor, name_sensor, unit_sensor, time_sensor, description_sensor, image_sensor, state_sensor) VALUES (?, ?, ?, ?, ?, ?, ?)";
    conexion.query(sql, [type_sensor, name_sensor, unit_sensor, time_sensor, description_sensor, image_sensor, state_sensor], (error, resultado) => {
        if (error) {
            console.error("Error al insertar datos:", error);
            return res.status(500).json({ error: "Error al insertar datos" });
        }
  
        console.log("Resultado del INSERT:", resultado);
        res.json({
            id: resultado.insertId
        });
    });
  });
  
  router.get("/sensors/:id", (req, res) => {
    const sensorId = req.params.id;
  
    let sql = "SELECT * FROM sensors WHERE id = ?";
    conexion.query(sql, [sensorId], (error, resultados) => {
        if (error) {
            console.error("Error al buscar sensor:", error);
            return res.status(500).json({ error: "Error al buscar sensor" });
        }
  
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "sensor no encontrado" });
        }
  
        res.json(resultados[0]);
    });
  });
  
  router.get('/sensors', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const buscar = req.query.buscar || '';
    const limit = 20;
    const offset = (page - 1) * limit;
  
    let queryData = `
      SELECT * FROM sensors 
      WHERE 
        id LIKE ? OR 
        type_sensors LIKE ? OR 
        name_sensors LIKE ? OR 
        unit_sensors LIKE ? OR 
        time_sensors LIKE ? OR 
        description_sensors LIKE ? 
      LIMIT ? OFFSET ?
    `;
    let params = [`%${buscar}%`,`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];
  
    let queryCount = `
      SELECT COUNT(*) AS total FROM sensors 
      WHERE 
        id LIKE ? OR 
        type_sensors LIKE ? OR 
        name_sensors LIKE ? OR 
        unit_sensors LIKE ? OR 
        time_sensors LIKE ? OR 
        description_sensors LIKE ? 
    `;
    let countParams = [`%${buscar}%`,`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`];
  
    conexion.query(queryData, params, (err, results) => {
      if (err) {
        console.error('Error al obtener sensores:', err);
        return res.status(500).send('Error al obtener sensores');
      }
  
      conexion.query(queryCount, countParams, (err2, countResult) => {
        if (err2) {
          console.error('Error al contar sensores:', err2);
          return res.status(500).send('Error al contar sensores');
        }
  
        const total = countResult[0].total;
        res.json({ sensores: results, total });
      });
    });
  });
  
  router.post('/sensors/:id', (req, res) => {
    const {
      id,
      tipo_sensor,
      nombre_sensor,
      cantidad_sensor,
      tiempo_sensor,
      descripcion_sensor,
    } = req.body;
  
    const query = `
      UPDATE sensors 
      SET 
        type_sensors = ?, 
        name_sensors = ?, 
        unit_sensors = ?, 
        time_sensors = ?, 
        description_sensors = ?
      WHERE id = ?
    `;
  
    conexion.query(query, [
        tipo_sensor,
        nombre_sensor,
        cantidad_sensor,
        tiempo_sensor,
        descripcion_sensor,
      id
    ], (err, result) => {
      if (err) {
        console.error('Error al actualizar el sensor:', err);
        return res.status(500).json({ error: 'Hubo un error al actualizar el sensor.' });
      }
  
      res.json({ message: 'sensor actualizado exitosamente.' });
    });
  });

  return router; // Exportamos el router
}

module.exports = sensors();