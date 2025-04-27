const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();

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

// Ruta para obtener un ciclo por ID
router.get("/cropcycle/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM cropcycle WHERE id = ?";

  conexion.query(sql, [id], (error, resultados) => {
    if (error) return res.status(500).json({ error: "Error al buscar ciclo" });
    if (resultados.length === 0) return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    res.json(resultados[0]);
  });
});

// Ruta para listar ciclos con paginación y búsqueda
router.get("/cropcycle", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || "";
  const limit = 20;
  const offset = (page - 1) * limit;
  const filtro = `%${buscar}%`;

  const queryData = `
    SELECT * FROM cropcycle
    WHERE 
      id LIKE ? OR 
      name_cropCycle LIKE ? OR 
      description_cycle LIKE ? OR
      news_cycle LIKE ?
    LIMIT ? OFFSET ?
  `;
  const params = [filtro, filtro, filtro, filtro, limit, offset];

  const queryCount = `
    SELECT COUNT(*) AS total FROM cropcycle
    WHERE 
      id LIKE ? OR 
      name_cropCycle LIKE ? OR 
      description_cycle LIKE ? OR
      news_cycle LIKE ?
  `;
  const countParams = [filtro, filtro, filtro, filtro];

  conexion.query(queryData, params, (err, results) => {
    if (err) return res.status(500).send("Error al obtener ciclos");

    conexion.query(queryCount, countParams, (err2, countResult) => {
      if (err2) return res.status(500).send("Error al contar ciclos");

      res.json({ ciclos: results, total: countResult[0].total });
    });
  });
});

// Ruta para actualizar un ciclo
router.post("/cropcycle/:id", (req, res) => {
  const { id, name_cropCycle, description_cycle, period_cycle_start, period_cycle_end, news_cycle, state_cycle } = req.body;

  const sql = `
    UPDATE cropcycle 
    SET 
      name_cropCycle = ?, 
      description_cycle = ?, 
      period_cycle_start = ?, 
      period_cycle_end = ?, 
      news_cycle = ?, 
      state_cycle = ?
    WHERE id = ?
  `;

  conexion.query(sql, [
    name_cropCycle, description_cycle, period_cycle_start,
    period_cycle_end, news_cycle, state_cycle, id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar el ciclo" });
    res.json({ mensaje: "Ciclo actualizado correctamente" });
  });
});

module.exports = router;
