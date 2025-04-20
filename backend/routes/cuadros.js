// La conexion con la bd
require("dotenv").config();
const express = require("express");
const cors = require("cors");
// ⬆️ Require para express mysql2 y cors para el correcto funcionamiento del back
const app = express(); // 👈 Le asignamos a app las propiedades express, para poder crear rutas
app.use(express.json());// 👈 Para que peuda analizar el cuerpo de las solicitudes (body)
app.use(cors());// 👈 Para poder hacer las solicitudes de puertos del back y front diferentes
const mysql = require("mysql2");

//⬇️ Configuramos conexión a la BD
const conexion = mysql.createConnection({ 
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});


// Conexión a la base de datos
conexion.connect(err => {
  if (err) {
    console.error('Error de conexión a la BD:', err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

// Crear tabla si no existe (puedes hacerlo solo una vez)
const crearTabla = `
  CREATE TABLE IF NOT EXISTS cuadros_seleccionados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuadro_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
conexion.query(crearTabla);

// Ruta para guardar cuadros seleccionados
app.post('/cuadros_seleccionados', (req, res) => {
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

// Ruta para obtener cuadros guardados
app.get('/cuadros_seleccionados', (req, res) => {
  conexion.query('SELECT cuadro_id FROM cuadros_seleccionados', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    const ids = result.map(row => row.cuadro_id);
    res.json(ids);
  });
});

// Iniciar servidor
app.listen(5501, () => {
  console.log('Servidor corriendo en http://localhost:5501');
});
