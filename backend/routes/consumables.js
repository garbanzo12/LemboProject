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

// Ruta para buscar por ID
router.get("/consumables/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM consumables WHERE id = ?";
  conexion.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al buscar insumo" });
    if (result.length === 0) return res.status(404).json({ mensaje: "Insumo no encontrado" });
    res.json(result[0]);
  });
});

// Ruta para listar con paginación y búsqueda
router.get("/consumables", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || '';
  const limit = 20;
  const offset = (page - 1) * limit;

  const filtro = `%${buscar}%`;
  const query = `
    SELECT * FROM consumables WHERE
      id LIKE ? OR name_consumables LIKE ? OR type_consumables LIKE ? OR
      quantity_consumables LIKE ? OR unit_consumables LIKE ? OR
      unitary_value LIKE ? OR total_value LIKE ? OR description_consumables LIKE ?
    LIMIT ? OFFSET ?
  `;
  const params = [filtro, filtro, filtro, filtro, filtro, filtro, filtro, filtro, limit, offset];

  const queryCount = `
    SELECT COUNT(*) AS total FROM consumables WHERE
      id LIKE ? OR name_consumables LIKE ? OR type_consumables LIKE ? OR
      quantity_consumables LIKE ? OR unit_consumables LIKE ? OR
      unitary_value LIKE ? OR total_value LIKE ? OR description_consumables LIKE ?
  `;
  const countParams = [filtro, filtro, filtro, filtro, filtro, filtro, filtro, filtro];

  conexion.query(query, params, (err, resultados) => {
    if (err) return res.status(500).send("Error al obtener insumos");
    conexion.query(queryCount, countParams, (err2, total) => {
      if (err2) return res.status(500).send("Error al contar insumos");
      res.json({ insumos: resultados, total: total[0].total });
    });
  });
});

// Ruta para actualizar un insumo
router.post("/consumables/:id", (req, res) => {
  const { id, tipo_insumo, nombre_insumo, cantidad_insumo, unidad_insumo, unidad_valor, total_valor, descripcion_insumo } = req.body;

  const sql = `
    UPDATE consumables SET
      type_consumables = ?, name_consumables = ?, quantity_consumables = ?,
      unit_consumables = ?, unitary_value = ?, total_value = ?, description_consumables = ?
    WHERE id = ?
  `;

  conexion.query(sql, [
    tipo_insumo, nombre_insumo, cantidad_insumo, unidad_insumo,
    unidad_valor, total_valor, descripcion_insumo, id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: "Hubo un error al actualizar el insumo" });
    res.json({ mensaje: "Insumo actualizado exitosamente" });
  });
});

module.exports = router;
