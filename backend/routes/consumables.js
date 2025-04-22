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

app.post("/consumables", (req, res) => {
    console.log("Datos recibidos en POST /consumables:", req.body); 

    const { type_consumables,name_consumables, quantity_consumables, unit_consumables, unitary_value,total_value,description_consumables,state_consumables } = req.body;

    if (!type_consumables || !name_consumables || !quantity_consumables || !unit_consumables || !unitary_value || !total_value || !description_consumables  || !state_consumables) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO consumables (type_consumables,name_consumables, quantity_consumables, unit_consumables, unitary_value, total_value,description_consumables,state_consumables) VALUES (?, ?, ?, ?, ? ,? ,?, ?)";
    conexion.query(sql, [type_consumables,name_consumables, quantity_consumables, unit_consumables, unitary_value,total_value,description_consumables,state_consumables], (error, resultado) => {
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

// ⬇️ Ruta para buscar un usumo por ID (modulo buscar)
app.get("/consumables/:id", (req, res) => {
    const consumableId = req.params.id;
  
    let sql = "SELECT * FROM consumables WHERE id = ?";
    conexion.query(sql, [consumableId], (error, resultados) => {
        if (error) {
            console.error("Error al buscar insumo:", error);
            return res.status(500).json({ error: "Error al buscar insumo" });
        }
  
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "insumo no encontrado" });
        }
  
        res.json(resultados[0]);
    });
  });
  // ⬆️ Ruta para buscar un insumo por ID (modulo buscar)
  

// ⬇️ Ruta para Listar (modulo listar)
// 🟢 Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
app.get('/consumables', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || ''; // 👈 palabra clave para buscar
  const limit = 20; // 👈 Limito la cantidad de digitos que voy a mostar por pagina
  const offset = (page - 1) * limit;

  // ⬇️ Si hay una búsqueda, usamos WHERE para poder buscarlo (Estamos opteniendo los datos del insumo)
  let queryData = `
    SELECT * FROM consumables 
    WHERE 
      id LIKE ? OR 
      name_consumables LIKE ? OR 
      type_consumables LIKE ? OR 
      quantity_consumables LIKE ? OR 
      unit_consumables LIKE ? OR   
      unitary_value LIKE ? OR 
      total_value LIKE ? OR 
      description_consumables LIKE ?
    LIMIT ? OFFSET ?
  `;
// ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , cantida, valor unitario, valor total y descripción
  let params = [`%${buscar}%`,`%${buscar}%`,`%${buscar}%`,`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];

// ⬇️ Si hay una búsqueda, usamos WHERE para poder contar cuantos datos estamos tomando (Estamos opteniendo la cantidad de datos del insumo)
  let queryCount = `
    SELECT COUNT(*) AS total FROM consumables 
    WHERE 
      id LIKE ? OR 
      name_consumables LIKE ? OR 
      type_consumables LIKE ? OR 
      quantity_consumables LIKE ? OR 
      unit_consumables LIKE ? OR   
      unitary_value LIKE ? OR 
      total_value LIKE ? OR 
      description_consumables LIKE ?
  `;
  // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , cantida, valor unitario, valor total y descripción

  let countParams = [`%${buscar}%`,`%${buscar}%`,`%${buscar}%`,`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

  conexion.query(queryData, params, (err, results) => {
    if (err) {
      console.error('Error al obtener insumos:', err);
      return res.status(500).send('Error al obtener insumos');
    }

    conexion.query(queryCount, countParams, (err2, countResult) => {
      if (err2) {
        console.error('Error al contar insumos:', err2);
        return res.status(500).send('Error al contar insumos');
      }

      const total = countResult[0].total;
      res.json({ insumos: results, total });
    });
  });
});

// ⬆️ Ruta para Listar (modulo listar)

//⬇️ Ruta para actualizar el insumo (modulo actualizar)
app.post('/consumables/:id', (req, res) => {
  
    const { // 👈 Estamos Inicializando los datos que va a tomar el front
      id,
      tipo_insumo,
      nombre_insumo,
      cantidad_insumo,
      unidad_insumo,
      unidad_valor,
      total_valor, 
      descripcion_insumo, 

    } = req.body;
  
    //⬇️Estamos haciendo Consulta SQL para actualizar los datos del insumo
    const query = `
      UPDATE consumables 
      SET 
        type_consumables = ?, 
        name_consumables = ?, 
        quantity_consumables = ?, 
        unit_consumables = ?, 
        unitary_value = ?,
        total_value = ?,
        description_consumables = ? 
      WHERE id = ?
    `;
  
    //⬇️ Ejecutamos la consulta
    conexion.query(query, [
      tipo_insumo,
      nombre_insumo,
      cantidad_insumo,
      unidad_insumo,
      unidad_valor,
      total_valor, 
      descripcion_insumo,
      id
    ], (err, result) => {
      if (err) {
        console.error('Error al actualizar el insumo:', err);
        return res.status(500).json({ error: 'Hubo un error al actualizar el insumo.' });
      }
  

      //⬇️Entonces éxito
      res.json({ message: 'insumo actualizado exitosamente.' });
    });
  });

    //⬆️ Ruta para actualizar el insumo (modulo actualizar)