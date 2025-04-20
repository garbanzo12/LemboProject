// La conexion con la bd
const mysql = require("mysql2");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
// ⬆️ Require para express mysql2 y cors para el correcto funcionamiento del back
const app = express(); // 👈 Le asignamos a app las propiedades express, para poder crear rutas
app.use(express.json());// 👈 Para que peuda analizar el cuerpo de las solicitudes (body)
app.use(cors());// 👈 Para poder hacer las solicitudes de puertos del back y front diferentes
console.log('USER:', process.env.USER); // debería mostrar 'root'
console.log('HOST:', process.env.HOST); // debería mostrar 'root'
console.log('PASSWORD:', process.env.PASSWORD); // debería mostrar 'root'
console.log('DATABASE:', process.env.DATABASE); // debería mostrar 'root'

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

//⬇️ Ruta para insertar datos ( modulo crear)
app.post("/crops", (req, res) => {
    console.log("Datos recibidos en POST /crops:", req.body); 

    const { name_crop, type_crop, location, description_crop, size_m2 } = req.body;

    if (!name_crop || !type_crop || !location || !description_crop || !size_m2) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO crops (name_crop, type_crop, location, description_crop, size_m2) VALUES (?, ?, ?, ?, ?)";
    conexion.query(sql, [name_crop, type_crop, location, description_crop, size_m2], (error, resultado) => {
        if (error) {
            console.error("Error al insertar datos:", error);
            return res.status(500).json({ error: "Error al insertar datos" });
        }

        console.log("Resultado del INSERT:", resultado);
        res.json({ 
            mensaje: "Datos guardados correctamente", 
            id: resultado.insertId
        });
    });
});
//⬆️ Ruta para insertar datos (modulo crear)

// ⬇️ Ruta para buscar un cultivo por ID (modulo buscar)
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
// ⬆️ Ruta para buscar un cultivo por ID

// ⬇️ Ruta para Listar (modulo listar)
// 🟢 Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
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
      description_crop LIKE ?
    LIMIT ? OFFSET ?
  `;
// ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción
  let params = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];

// ⬇️ Si hay una búsqueda, usamos WHERE para poder contar cuantos datos estamos tomando (Estamos opteniendo la cantidad de datos del cultivo)
  let queryCount = `
    SELECT COUNT(*) AS total FROM crops 
    WHERE 
      id LIKE ? OR 
      name_crop LIKE ? OR 
      type_crop LIKE ? OR 
      location LIKE ? OR 
      description_crop LIKE ?
  `;
  // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción

  let countParams = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

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



// Ruta para actualizar el cultivo
app.post('/crops/:id', (req, res) => {
  
    const { // 👈 Estamos Inicializando los datos que va a tomar el front
      id,
      nombre_cultivo,
      tipo_cultivo,
      ubicacion_cultivo,
      descripcion_cultivo,
      tamano_cultivo,
    } = req.body;
  
    //⬇️Estamos haciendo Consulta SQL para actualizar los datos del cultivo
    const query = `
      UPDATE crops 
      SET 
        name_crop = ?, 
        type_crop = ?, 
        location = ?, 
        description_crop = ?, 
        size_m2 = ?
      WHERE id = ?
    `;
  
    // Ejecutar la consulta
    conexion.query(query, [
      nombre_cultivo,
      tipo_cultivo,
      ubicacion_cultivo,
      descripcion_cultivo,
      tamano_cultivo, 
      id
    ], (err, result) => {
      if (err) {
        console.error('Error al actualizar el cultivo:', err);
        return res.status(500).json({ error: 'Hubo un error al actualizar el cultivo.' });
      }
  
      // Responder con éxito
      res.json({ message: 'Cultivo actualizado exitosamente.' });
    });
  });