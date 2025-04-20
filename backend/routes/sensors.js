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
//⬇️ Ruta para insertar datos (modulo crear)
app.post("/sensors", (req, res) => {
    console.log("Datos recibidos en POST /sensors:", req.body); 

    const { type_sensors,name_sensors, unit_sensors, time_sensors} = req.body;

    if (!type_sensors || !name_sensors || !unit_sensors || !time_sensors) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO sensors (type_sensors,name_sensors, unit_sensors, time_sensors) VALUES (?, ?, ? ,?)";
    conexion.query(sql, [type_sensors,name_sensors, unit_sensors,time_sensors], (error, resultado) => {
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



// ⬇️ Ruta para buscar un sensor por ID (modulo buscar)
app.get("/sensors/:id", (req, res) => {
    const sensorId = req.params.id;
  
    let sql = "SELECT * FROM sensors WHERE id = ?";
    conexion.query(sql, [sensorId], (error, resultados) => {
        if (error) {
            console.error("Error al buscar sensor:", error);
            return res.status(500).json({ error: "Error al buscar sensor" });
        }
  
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "sensor no encontrado" });
        }
  
        res.json(resultados[0]);
    });
  });
  // ⬆️ Ruta para buscar un sensor por ID (modulo buscar)
  



  
// ⬇️ Ruta para Listar (modulo listar)
// 🟢 Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
app.get('/sensors', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || ''; // 👈 palabra clave para buscar
  const limit = 20; // 👈 Limito la cantidad de digitos que voy a mostar por pagina
  const offset = (page - 1) * limit;

  // ⬇️ Si hay una búsqueda, usamos WHERE para poder buscarlo (Estamos opteniendo los datos del sensor)
  let queryData = `
    SELECT * FROM sensors 
    WHERE 
      id LIKE ? OR 
      type_sensors LIKE ? OR 
      name_sensors LIKE ? OR 
      unit_sensors LIKE ? OR 
      time_sensors LIKE ? OR 
      description_sensors LIKE ? 
    LIMIT ? OFFSET ?
  `;
// ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción
  let params = [`%${buscar}%`,`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];

// ⬇️ Si hay una búsqueda, usamos WHERE para poder contar cuantos datos estamos tomando (Estamos opteniendo la cantidad de datos del sensor)
  let queryCount = `
    SELECT COUNT(*) AS total FROM sensors 
    WHERE 
      id LIKE ? OR 
      type_sensors LIKE ? OR 
      name_sensors LIKE ? OR 
      unit_sensors LIKE ? OR 
      time_sensors LIKE ? OR 
      description_sensors LIKE ? 
  `;
  // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción

  let countParams = [`%${buscar}%`,`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

  conexion.query(queryData, params, (err, results) => {
    if (err) {
      console.error('Error al obtener sensores:', err);
      return res.status(500).send('Error al obtener sensores');
    }

    conexion.query(queryCount, countParams, (err2, countResult) => {
      if (err2) {
        console.error('Error al contar sensores:', err2);
        return res.status(500).send('Error al contar sensores');
      }

      const total = countResult[0].total;
      res.json({ sensores: results, total });
    });
  });
});

// ⬆️ Ruta para Listar (modulo listar)



//⬇️ Ruta para actualizar el sensor (modulo actualizar)
app.post('/sensors/:id', (req, res) => {
  
    const { // 👈 Estamos Inicializando los datos que va a tomar el front
      id,
      tipo_sensor,
      nombre_sensor,
      cantidad_sensor,
      tiempo_sensor,
      descripcion_sensor,
    } = req.body;
  
    //⬇️Estamos haciendo Consulta SQL para actualizar los datos del sensor
    const query = `
      UPDATE sensors 
      SET 
        type_sensors = ?, 
        name_sensors = ?, 
        unit_sensors = ?, 
        time_sensors = ?, 
        description_sensors = ?
      WHERE id = ?
    `;
  
    //⬇️ Ejecutamos la consulta
    conexion.query(query, [
        tipo_sensor,
        nombre_sensor,
        cantidad_sensor,
        tiempo_sensor,
        descripcion_sensor,
      id
    ], (err, result) => {
      if (err) {
        console.error('Error al actualizar el sensor:', err);
        return res.status(500).json({ error: 'Hubo un error al actualizar el sensor.' });
      }
  
      //⬇️Entonces éxito
      res.json({ message: 'sensor actualizado exitosamente.' });
    });
  });
  //⬆️ Ruta para actualizar el sensor (modulo actualizar)