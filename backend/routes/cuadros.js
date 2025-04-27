

  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const router = express.Router(); // Cambiado: app → router
  router.use(express.json());
  router.use(cors());
  const mysql = require("mysql2");

  const conexion = mysql.createConnection({ 
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  conexion.connect((err) => {
    if (err) throw err;
    console.log("Conectado a MySQL [Cuadros]");
  });
  conexion.connect(err => {
    if (err) {
      console.error('Error de conexión a la BD:', err);
    }
  });

  const crearTabla = `
    CREATE TABLE IF NOT EXISTS cuadros_seleccionados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cuadro_id INT NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  conexion.query(crearTabla);

  router.post('/cuadros_seleccionados', (req, res) => {
    const cuadros = req.body.seleccionados;

    if (!Array.isArray(cuadros) || cuadros.length === 0) {
      return res.status(400).json({ mensaje: 'No se enviaron cuadros' });
    }

    const values = cuadros.map(id => [id]);
    const sql = 'INSERT INTO cuadros_seleccionados (cuadro_id) VALUES ?';

    conexion.query(sql, [values], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensaje: 'Error al guardar', error: err });
      }
      res.json({ mensaje: 'Cuadros guardados', insertados: result.affectedRows });
    });
  });

  router.get('/cuadros_seleccionados', (req, res) => {
    conexion.query('SELECT cuadro_id FROM cuadros_seleccionados', (err, result) => {
      if (err) return res.status(500).json({ error: err });
      const ids = result.map(row => row.cuadro_id);
      res.json(ids);
    });
  });




module.exports = router;