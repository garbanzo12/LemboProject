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
//⬇️ Ruta para insertar datos ( modulo crear)

app.post("/users", (req, res) => {
    console.log("Datos recibidos en POST /users:", req.body); 

    const { type_user,type_ID, name_user, email, contact,password } = req.body;

    if (!type_user || !type_ID || !name_user || !email || !contact  || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO users (type_user,type_ID, name_user, email, contact,password) VALUES (?, ?, ?, ?, ?, ?)";
    conexion.query(sql, [type_user, type_ID, name_user, email, contact,password], (error, resultado) => {
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


// ⬇️ Ruta para buscar un usuario por ID (modulo buscar)
app.get("/users/:id", (req, res) => {
    const usersId = req.params.id;
  
    let sql = "SELECT * FROM users WHERE id = ?";
    conexion.query(sql, [usersId], (error, resultados) => {
        if (error) {
            console.error("Error al buscar usuario:", error);
            return res.status(500).json({ error: "Error al buscar usuario" });
        }
  
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "usuario no encontrado" });
        }
  
        res.json(resultados[0]);
    });
  });
  // ⬆️ Ruta para buscar un usuario por ID (modulo buscar)
  
  
// ⬇️ Ruta para Listar (modulo listar)
// 🟢 Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
app.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || ''; // 👈 palabra clave para buscar
  const limit = 20; // 👈 Limito la cantidad de digitos que voy a mostar por pagina
  const offset = (page - 1) * limit;

  // ⬇️ Si hay una búsqueda, usamos WHERE para poder buscarlo (Estamos opteniendo los datos del usuario)
  let queryData = `
    SELECT * FROM users 
    WHERE 
      id LIKE ? OR 
      type_user LIKE ? OR 
      name_user LIKE ? OR 
      state LIKE ? OR 
    LIMIT ? OFFSET ?
  `;
// ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción
  let params = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`,limit, offset];

// ⬇️ Si hay una búsqueda, usamos WHERE para poder contar cuantos datos estamos tomando (Estamos opteniendo la cantidad de datos del usuario)
  let queryCount = `
    SELECT COUNT(*) AS total FROM users 
    WHERE 
      id LIKE ? OR 
      type_user LIKE ? OR 
      name_user LIKE ? OR 
      state LIKE ? 
  `;
  // ⬇️ Iniciamos los parametros correspondientes a id , nombre , tipo , ubicación y descripción

  let countParams = [`%${buscar}%`,`%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

  conexion.query(queryData, params, (err, results) => {
    if (err) {
      console.error('Error al obtener usuario:', err);
      return res.status(500).send('Error al obtener usuario');
    }

    conexion.query(queryCount, countParams, (err2, countResult) => {
      if (err2) {
        console.error('Error al contar usuario:', err2);
        return res.status(500).send('Error al contar usuario');
      }

      const total = countResult[0].total;
      res.json({ usuarios: results, total });
    });
  });
});

// ⬆️ Ruta para Listar (modulo listar)


//⬇️ Ruta para actualizar el usuario (modulo actualizar)
app.post('/crops/:id', (req, res) => {
  
    const { // 👈 Estamos Inicializando los datos que va a tomar el front
      id,
      tipo_usuario,
      celular,
      estado,
      contrasena,
    } = req.body;
  
    //⬇️Estamos haciendo Consulta SQL para actualizar los datos del usuario
    const query = `
      UPDATE users 
      SET 
        type_user = ?, 
        cellphone = ?, 
        state = ?, 
        password = ?, 
      WHERE id = ?
    `;
  
    //⬇️ Ejecutamos la consulta
    conexion.query(query, [
        tipo_usuario,
        celular,
        estado,
        contrasena,
      id
    ], (err, result) => {
      if (err) {
        console.error('Error al actualizar el usuario:', err);
        return res.status(500).json({ error: 'Hubo un error al actualizar el usuario.' });
      }
  
      //⬇️Entonces éxito
      res.json({ message: 'usuario actualizado exitosamente.' });
    });
  });
  //⬆️ Ruta para actualizar el usuario (modulo actualizar)