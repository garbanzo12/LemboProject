const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configura tus datos de conexión MySQL aquí
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456', // cambia si tu contraseña es diferente
  database: 'lembo_sgal_db'
});

// Conexión a la base de datos
db.connect(err => {
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
db.query(crearTabla);

// Ruta para guardar cuadros seleccionados
app.post('/cuadros_seleccionados', (req, res) => {
  const cuadros = req.body.seleccionados;

  if (!Array.isArray(cuadros) || cuadros.length === 0) {
    return res.status(400).json({ mensaje: 'No se enviaron cuadros' });
  }

  const values = cuadros.map(id => [id]);
  const sql = 'INSERT INTO cuadros_seleccionados (cuadro_id) VALUES ?';

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al guardar', error: err });
    }
    res.json({ mensaje: 'Cuadros guardados', insertados: result.affectedRows });
  });
});

// Ruta para obtener cuadros guardados
app.get('/cuadros_seleccionados', (req, res) => {
  db.query('SELECT cuadro_id FROM cuadros_seleccionados', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    const ids = result.map(row => row.cuadro_id);
    res.json(ids);
  });
});

// Iniciar servidor
app.listen(5501, () => {
  console.log('Servidor corriendo en http://localhost:5501');
});
