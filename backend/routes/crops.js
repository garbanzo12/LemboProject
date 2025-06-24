function crops(){

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
  
  // Configurar Multer para subir imágenes
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });
  
  // Conexión a la base de datos
  const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  
  conexion.connect((err) => {
    if (err) throw err;
    console.log("Conectado a MySQL [crops]");
  });
  
  
  // Ruta para insertar un cultivo
  router.post("/crops", upload.single("image_crop"), (req, res) => {
    const { name_crop, type_crop, location, description_crop, size_m2 } = req.body;
    const image_crop = req.file ? req.file.filename : null;
  
    if (!name_crop || !type_crop || !location || !description_crop || !size_m2 || !image_crop) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    const sql = `
      INSERT INTO crops (name_crop, type_crop, location, description_crop, size_m2, image_crop)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    conexion.query(sql, [name_crop, type_crop, location, description_crop, size_m2, image_crop], (error, resultado) => {
      if (error) {
        console.error("Error al insertar cultivo:", error);
        return res.status(500).json({ error: "Error al insertar cultivo" });
      }
  
      res.json({ id: resultado.insertId });
    });
  });
  
  
  // Ruta para actualizar un cultivo
  router.put("/api/crops/:id", upload.single("imagen_cultivo"), (req, res) => {
    const cropId = req.params.id;
    const {
      nombre_cultivo,
      tipo_cultivo,
      ubicacion_cultivo,
      descripcion_cultivo,
      tamano_cultivo
    } = req.body;
  
    const imagen_cultivo = req.file ? req.file.filename : null;
  
    let query = `
      UPDATE crops 
      SET name_crop = ?, type_crop = ?, location = ?, description_crop = ?, size_m2 = ?
    `;
    const values = [nombre_cultivo, tipo_cultivo, ubicacion_cultivo, descripcion_cultivo, tamano_cultivo];
  
    if (imagen_cultivo) {
      query += `, image_crop = ?`;
      values.push(imagen_cultivo);
    }
  
    query += ` WHERE id = ?`;
    values.push(cropId);
  
    conexion.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar cultivo:", err);
        return res.status(500).json({ error: "Error al actualizar cultivo" });
      }
      res.json({ mensaje: "Cultivo actualizado exitosamente" });
    });
  });
  
  
  // Ruta para obtener cultivo por ID
  router.get("/api/crops/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM crops WHERE id = ?";
  
    conexion.query(sql, [id], (error, resultado) => {
      if (error) return res.status(500).json({ error: "Error al obtener cultivo" });
      if (resultado.length === 0) return res.status(404).json({ mensaje: "Cultivo no encontrado" });
      res.json(resultado[0]);
    });
  });
  
  
  // Ruta para listar IDs de cultivos (Modulo Buscar)
  router.get("/crops/id", (req, res) => {
    const sql = "SELECT id FROM crops";
    conexion.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Error al obtener IDs" });
      const ids = results.map(row => row.id);
      res.json({ cultivos: ids });
    });
  });
  
  
  // Ruta para listar cultivos con paginación y búsqueda
  router.get("/crops", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const buscar = req.query.buscar || "";
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const filtro = `%${buscar}%`;
  
    const queryData = `
      SELECT * FROM crops
      WHERE 
        id LIKE ? OR 
        name_crop LIKE ? OR 
        type_crop LIKE ? OR 
        location LIKE ? OR 
        description_crop LIKE ? OR 
        size_m2 LIKE ?
      LIMIT ? OFFSET ?
    `;
  
    const queryCount = `
      SELECT COUNT(*) AS total FROM crops
      WHERE 
        id LIKE ? OR 
        name_crop LIKE ? OR 
        type_crop LIKE ? OR 
        location LIKE ? OR 
        description_crop LIKE ? OR 
        size_m2 LIKE ?
    `;
  
    const params = [filtro, filtro, filtro, filtro, filtro, filtro, limit, offset];
    const countParams = [filtro, filtro, filtro, filtro, filtro, filtro];
  
    conexion.query(queryData, params, (err, results) => {
      if (err) return res.status(500).json({ error: "Error al obtener cultivos" });
  
      conexion.query(queryCount, countParams, (err2, count) => {
        if (err2) return res.status(500).json({ error: "Error al contar cultivos" });
  
        res.json({ cultivos: results, total: count[0].total });
      });
    });
  });
  return router; // Exportamos el router

}

module.exports = crops();
