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

conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
  });


app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));

//⬇️ Ruta para insertar datos (modulo crear)
app.post("/cropcycle", (req, res) => {
    console.log("Datos recibidos en POST /cropcycle:", req.body); 

    const { name_cropCycle,description_cycle, period_cycle_start,period_cycle_end,news_cycle,state_cycle} = req.body;

    if (!name_cropCycle || !description_cycle || !period_cycle_start || !period_cycle_end || !news_cycle || !state_cycle) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO cropcycle (name_cropCycle,description_cycle, period_cycle_start,period_cycle_end,news_cycle,state_cycle) VALUES (?, ?, ?, ?, ?, ?)";
    conexion.query(sql, [name_cropCycle,description_cycle, period_cycle_start,period_cycle_end,news_cycle,state_cycle], (error, resultado) => {
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

// ⬇️ Ruta para buscar un ciclo por ID (modulo buscar)
// app.get("/cropcycle/:id", (req, res) => {
//     const cycleId = req.params.id;
  
//     let sql = "SELECT * FROM cropcycle WHERE id = ?";
//     conexion.query(sql, [cycleId], (error, resultados) => {
//         if (error) {
//             console.error("Error al buscar ciclo:", error);
//             return res.status(500).json({ error: "Error al buscar ciclo" });
//         }
  
//         if (resultados.length === 0) {
//             return res.status(404).json({ mensaje: "ciclo no encontrado" });
//         }
  
//         res.json(resultados[0]);
//     });
//   });
//   // ⬆️ Ruta para buscar un ciclo por ID (modulo buscar)


// // ⬇️ Ruta para Listar (modulo listar)
// // 🟢 Iniciar servidor
// app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
// app.get('/cropcycle', (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const buscar = req.query.buscar || ''; // 👈 palabra clave para buscar
//   const limit = 20; // 👈 Limito la cantidad de digitos que voy a mostar por pagina
//   const offset = (page - 1) * limit;

//   // ⬇️ Si hay una búsqueda, usamos WHERE para poder buscarlo (Estamos opteniendo los datos del ciclo)
//   let queryData = `
//     SELECT * FROM cropcycle 
//     WHERE 
//       id LIKE ? OR 
//       name_cropCycle LIKE ? OR 
//       news LIKE ? OR 
//       size_cropCycle LIKE ?
//     LIMIT ? OFFSET ?
//   `;
// // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción
//   let params = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];

// // ⬇️ Si hay una búsqueda, usamos WHERE para poder contar cuantos datos estamos tomando (Estamos opteniendo la cantidad de datos del ciclo)
//   let queryCount = `
//     SELECT COUNT(*) AS total FROM cropcycle 
//     WHERE 
//       id LIKE ? OR 
//       name_cropCycle LIKE ? OR 
//       news LIKE ? OR 
//       size_cropCycle LIKE ? 
//   `;
//   // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción

//   let countParams = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

//   conexion.query(queryData, params, (err, results) => {
//     if (err) {
//       console.error('Error al obtener ciclo:', err);
//       return res.status(500).send('Error al obtener ciclo');
//     }

//     conexion.query(queryCount, countParams, (err2, countResult) => {
//       if (err2) {
//         console.error('Error al contar ciclo:', err2);
//         return res.status(500).send('Error al contar ciclo');
//       }

//       const total = countResult[0].total;
//       res.json({ ciclos: results, total });
//     });
//   });
// });

// // ⬆️ Ruta para Listar (modulo listar)


// //⬇️ Ruta para actualizar el ciclo (modulo actualizar)
// app.post('/cropcycle/:id', (req, res) => {
  
//     const { // 👈 Estamos Inicializando los datos que va a tomar el front
//       id,
//       nombre_ciclocultivo,
//       noticias,
//       tamano_ciclocultivo,
//     } = req.body;
  
//     //⬇️Estamos haciendo Consulta SQL para actualizar los datos del ciclo
//     const query = `
//       UPDATE cropcycle 
//       SET 
//         name_crop = ?, 
//         type_crop = ?, 
//         location = ?, 
//         description_crop = ?, 
//         size_m2 = ?
//       WHERE id = ?
//     `;
  
//     //⬇️ Ejecutamos la consulta
//     conexion.query(query, [
//       nombre_ciclocultivo,
//       noticias,
//       tamano_ciclocultivo, 
//       id
//     ], (err, result) => {
//       if (err) {
//         console.error('Error al actualizar el ciclo:', err);
//         return res.status(500).json({ error: 'Hubo un error al actualizar el ciclo.' });
//       }
  
//       //⬇️Entonces éxito
//       res.json({ message: 'ciclo actualizado exitosamente.' });
//     });
//   });
  //⬆️ Ruta para actualizar el ciclo (modulo actualizar)