function cropcycle(){
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
  console.log("Conectado a MySQL [cropCycle]");
});

// Ruta para insertar ciclo de cultivo
router.post("/cropcycle", (req, res) => {
  const {
    name_cropCycle,
    description_cycle,
    period_cycle_start,
    period_cycle_end,
    news_cycle,
    state_cycle
  } = req.body;

  if (!name_cropCycle || !description_cycle || !period_cycle_start || !period_cycle_end || !news_cycle || !state_cycle) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = `
    INSERT INTO cropcycle (
      name_cropCycle, description_cycle, period_cycle_start,
      period_cycle_end, news_cycle, state_cycle
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  conexion.query(sql, [
    name_cropCycle, description_cycle, period_cycle_start,
    period_cycle_end, news_cycle, state_cycle
  ], (error, resultado) => {
    if (error) {
      console.error("Error al insertar ciclo:", error);
      return res.status(500).json({ error: "Error al insertar ciclo" });
    }

    res.json({
      mensaje: "Ciclo guardado correctamente",
      id: resultado.insertId
    });
  });
});


// Ruta para actualizar un cultivo
router.put("/api/cropcycle/:id",upload.none(), (req, res) => {
  const cycleId = req.params.id;
  const {
    nombre_ciclo,
    periodo_inicio,
    periodo_fin,
    descripcion_ciclo,
    novedades_ciclo,
    estado_ciclo
  } = req.body;


  let query = `
    UPDATE cropcycle 
    SET name_cropCycle = ?, period_cycle_start = ?, period_cycle_end = ?, description_cycle = ?, news_cycle = ?, state_cycle = ?
  `;
  const values = [nombre_ciclo, periodo_inicio, periodo_fin, descripcion_ciclo, novedades_ciclo,estado_ciclo];

  
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

// Ruta para obtener cultivo por ID
router.get("/api/cropcycle/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM cropcycle WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) return res.status(500).json({ error: "Error al obtener Ciclo" });
    if (resultado.length === 0) return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    res.json(resultado[0]);
  });
});


// Ruta para listar IDs de cultivos
router.get("/cropcycle/id", (req, res) => {
  const sql = "SELECT id FROM cropcycle";
  conexion.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener IDs" });
    const ids = results.map(row => row.id);
    res.json({ ciclos : ids });
  });
});





// Ruta para listar cultivos con paginación y búsqueda
router.get("/cropcycle", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  const filtro = `%${buscar}%`;

  const queryData = `
    SELECT * FROM cropcycle
    WHERE 
      id LIKE ? OR 
      name_cropCycle LIKE ? OR 
      description_cycle LIKE ? OR 
      news_cycle LIKE ? OR 
      period_cycle_start LIKE ? OR 
      period_cycle_end LIKE ?
    LIMIT ? OFFSET ?
  `;

  const queryCount = `
    SELECT COUNT(*) AS total FROM cropcycle
    WHERE 
      id LIKE ? OR 
      name_cropCycle LIKE ? OR 
      description_cycle LIKE ? OR 
      news_cycle LIKE ? OR 
      period_cycle_start LIKE ? OR 
      period_cycle_end LIKE ?
  `;

  const params = [filtro, filtro, filtro, filtro, filtro, filtro, limit, offset];
  const countParams = [filtro, filtro, filtro, filtro, filtro, filtro];

  conexion.query(queryData, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener ciclo" });

    conexion.query(queryCount, countParams, (err2, count) => {
      if (err2) return res.status(500).json({ error: "Error al contar ciclo" });

      res.json({ ciclos : results, total: count[0].total });
    });
  });
});
return router; // Exportamos el router

}
module.exports = cropcycle();
