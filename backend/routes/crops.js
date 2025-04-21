require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware para CORS (debe ir antes de las rutas)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para analizar formularios codificados (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// 🔥 Aquí sirve la carpeta 'uploads' como pública
app.use('/uploads', express.static('uploads'));

// Configurar multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//⬇️ Configuramos conexión a la BD
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));

//⬇️ Ruta para insertar datos ( modulo crear)
app.post("/crops", upload.single("image_crop"), (req, res) => {
    console.log("Datos recibidos en POST /crops:", req.body);

    const { name_crop, type_crop, location, description_crop, size_m2 } = req.body;
    const image_crop = req.file ? req.file.filename : null;

    if (!name_crop || !type_crop || !location || !description_crop || !size_m2 || !image_crop) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO crops (name_crop, type_crop, location, description_crop, size_m2, image_crop) VALUES (?, ?, ?, ?, ?, ?)";
    conexion.query(sql, [name_crop, type_crop, location, description_crop, size_m2, image_crop], (error, resultado) => {
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

// // ⬇️ Ruta para buscar un cultivo por ID (modulo buscar)

// ✅ Ruta para obtener solo los IDs de cultivos (sin límite de paginación)
app.get('/crops/id', (req, res) => {
  const sql = 'SELECT id FROM crops';
  conexion.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los IDs de cultivos:', err);
      return res.status(500).json({ error: 'Error al obtener los IDs' });
    }

    const ids = results.map(row => row.id);
    res.json({ cultivos: ids });
  });
});
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
// // ⬆️ Ruta para buscar un cultivo por ID (modulo buscar)


//⬇️ Ruta para actualizar el cultivo (modulo actualizar)
app.put('/crops/:id', upload.single('imagen_cultivo'), (req, res) => { // No olvides el middleware multer
  const cropId = req.params.id;

  const {
    nombre_cultivo,
    tipo_cultivo,
    ubicacion_cultivo,
    descripcion_cultivo,
    tamano_cultivo
  } = req.body;

  const imagen_cultivo = req.file ? req.file.filename : null;

  // Query base SIN la coma final
  let query = `
    UPDATE crops 
    SET 
      name_crop = ?, 
      type_crop = ?, 
      location = ?, 
      description_crop = ?, 
      size_m2 = ?
  `;

  const values = [
    nombre_cultivo,
    tipo_cultivo,
    ubicacion_cultivo,
    descripcion_cultivo,
    tamano_cultivo
  ];

  // Agregar imagen solo si existe
  if (imagen_cultivo) {
    query = query.replace('size_m2 = ?', 'size_m2 = ?, image_crop = ?');
    values.push(imagen_cultivo);
  }

  // Añadir WHERE (solo una vez)
  query += ' WHERE id = ?';
  values.push(cropId);

  console.log('Query final:', query); // Para depuración
  console.log('Valores:', values);   // Para depuración

  conexion.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el cultivo:', err);
      return res.status(500).json({ 
        error: 'Hubo un error al actualizar el cultivo.',
        detalles: err.message 
      });
    }
    res.json({ message: 'Cultivo actualizado exitosamente.' });
  });
});
  //⬆️ Ruta para actualizar el cultivo (modulo actualizar)

// ⬇️ Ruta para Listar (modulo listar)
// 🟢 Iniciar servidor
app.get('/crops', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || ''; // 👈 palabra clave para buscar
  const limit = 20; // 👈 Limito la cantidad de digitos que voy a mostar por pagina
  const offset = (page - 1) * limit;

  // ⬇️ Si hay una búsqueda, usamos WHERE para poder buscarlo (Estamos opteniendo los datos del cultivo)
  let queryData = `
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
// ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción
  let params = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];

// ⬇️ Si hay una búsqueda, usamos WHERE para poder contar cuantos datos estamos tomando (Estamos opteniendo la cantidad de datos del cultivo)
  let queryCount = `
    SELECT COUNT(*) AS total FROM crops 
    WHERE 
      id LIKE ? OR 
      name_crop LIKE ? OR 
      type_crop LIKE ? OR 
      location LIKE ? OR 
      description_crop LIKE ? OR
      size_m2 LIKE ?  
  `;
  // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción

  let countParams = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

  conexion.query(queryData, params, (err, results) => {
    if (err) {
      console.error('Error al obtener cultivos:', err);
      return res.status(500).send('Error al obtener cultivos');
    }

    conexion.query(queryCount, countParams, (err2, countResult) => {
      if (err2) {
        console.error('Error al contar cultivos:', err2);
        return res.status(500).send('Error al contar cultivos');
      }

      const total = countResult[0].total;
      res.json({ cultivos: results, total });
    });
  });
});

// ⬆️ Ruta para Listar (modulo listar)
