const multer = require('multer');
const upload = multer();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();
const cors = require("cors");
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
// Conexión a la base de datos
const conexion = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
conexion.connect((err) => {
  if (err) throw err;
  console.log("Conectado a MySQL [consumables]");
});
// Ruta para crear insumo
router.post("/consumables", (req, res) => {
  const {
    type_consumables,
    name_consumables,
    quantity_consumables,
    unit_consumables,
    unitary_value,
    total_value,
    description_consumables,
    state_consumables
  } = req.body;

  if (!type_consumables || !name_consumables || !quantity_consumables || !unit_consumables || !unitary_value || !total_value || !description_consumables || !state_consumables) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = `
    INSERT INTO consumables (
      type_consumables, name_consumables, quantity_consumables, unit_consumables,
      unitary_value, total_value, description_consumables, state_consumables
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  conexion.query(sql, [
    type_consumables, name_consumables, quantity_consumables, unit_consumables,
    unitary_value, total_value, description_consumables, state_consumables
  ], (error, resultado) => {
    if (error) {
      console.error("Error al insertar datos:", error);
      return res.status(500).json({ error: "Error al insertar datos" });
    }

    res.json({ mensaje: "Datos guardados correctamente", id: resultado.insertId });
  });
});



// Ruta para listar cultivos con paginación y búsqueda
router.get("/consumables", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  const filtro = `%${buscar}%`;

  const queryData = `
    SELECT * FROM consumables
    WHERE 
      id LIKE ? OR 
      type_consumables LIKE ? OR 
      name_consumables LIKE ? OR 
      quantity_consumables LIKE ? OR 
      unit_consumables LIKE ? OR 
      unitary_value LIKE ? OR
      total_value LIKE ? OR 
      description_consumables LIKE ? OR 
    LIMIT ? OFFSET ?
  `;

  const queryCount = `
    SELECT COUNT(*) AS total FROM consumables
    WHERE 
      id LIKE ? OR 
      type_consumables LIKE ? OR 
      name_consumables LIKE ? OR 
      quantity_consumables LIKE ? OR 
      unit_consumables LIKE ? OR 
      unitary_value LIKE ? OR
      total_value LIKE ? OR 
      description_consumables LIKE ? OR 
  `;

  const params = [filtro, filtro, filtro, filtro, filtro, filtro,filtro, filtro,  limit, offset];
  const countParams = [filtro, filtro, filtro, filtro, filtro, filtro, filtro, filtro, ];

  conexion.query(queryData, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener ciclo" });

    conexion.query(queryCount, countParams, (err2, count) => {
      if (err2) return res.status(500).json({ error: "Error al contar ciclo" });

      res.json({ insumos : results, total: count[0].total });
    });
  });
});

// Ruta para actualizar un insumo
router.put("/api/consumables-actualizar/:id",upload.none(), (req, res) => {
  const cycleId = req.params.id;
  const {
    tipo_insumo,
    nombre_insumo,
    cantidad_insumo,
    unidad_insumo,
    unidad_valor,
    total_valor,
    descripcion_insumo,
    estado_insumo
  } = req.body;


  let query = `
    UPDATE consumables 
    SET type_consumables = ?, name_consumables = ?, quantity_consumables = ?, unit_consumables  = ?, unitary_value = ?, total_value = ?, description_consumables = ?, state_consumables = ?
  `;
  const values = [tipo_insumo, nombre_insumo, cantidad_insumo, unidad_insumo, unidad_valor,total_valor,descripcion_insumo,estado_insumo];

  
  query += ` WHERE id = ?`;
  values.push(cycleId);

  conexion.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar ciclo:", err);
      return res.status(500).json({ error: "Error al actualizar ciclo" });
    }
    res.json({ mensaje: "ciclo actualizado exitosamente" });
  });
});



// Ruta para obtener Insumo por ID
router.get("/api/consumables/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM consumables WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) return res.status(500).json({ error: "Error al obtener Ciclo" });
    if (resultado.length === 0) return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    res.json(resultado[0]);
  });
});


// Ruta para listar IDs de Insumos
router.get("/consumables/id", (req, res) => {
  const sql = "SELECT id FROM consumables";
  conexion.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener IDs" });
    const ids = results.map(row => row.id);
    res.json({ insumos : ids });
  });
});



 

module.exports = router;
