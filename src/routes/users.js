const express = require("express");
const bcrypt = require('bcrypt');
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
  console.log("Conectado a MySQL [users]");
});
const router = express.Router();

// Ruta para insertar datos (modulo crear)
router.post("/users", async (req, res) => {
  console.log("Datos recibidos en POST /users:", req.body); 

  const { type_user, type_ID, num_document_identity, name_user, email, cellphone, password, state_user } = req.body;

  if (!type_user || !type_ID || !num_document_identity || !name_user || !email || !cellphone || !password || !state_user) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
      // Hashear la contraseña antes de guardar
      const hashedPassword = await bcrypt.hash(password, 10); // 10 = número de 'salt rounds'

      const sql = "INSERT INTO users (type_user, type_ID, num_document_identity, name_user, email, cellphone, password, state_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      conexion.query(sql, [type_user, type_ID, num_document_identity, name_user, email, cellphone, hashedPassword, state_user], (error, resultado) => {
          if (error) {
              console.error("Error al insertar datos:", error);
              return res.status(500).json({ error: "El Correo ya esta registrado" });
          }

          console.log("Resultado del INSERT:", resultado);
          res.json({ 
              mensaje: "Datos guardados correctamente", 
              id: resultado.insertId
          });
      });

  } catch (error) {
      console.error("Error al hashear la contraseña:", error);
      res.status(500).json({ error: "Error al procesar la contraseña" });
  }
});

// Ruta para buscar un usuario por ID (modulo buscar)
router.get("/users/:id", (req, res) => {
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

// Ruta para listar usuarios (modulo listar)
router.get("/users", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || ''; // palabra clave para buscar
  const limit = 20; // Limito la cantidad de registros que voy a mostrar por página
  const offset = (page - 1) * limit;

  // Consulta para obtener los usuarios
  let queryData = `
    SELECT * FROM users 
    WHERE 
      id LIKE ? OR 
      type_user LIKE ? OR 
      name_user LIKE ? OR 
      state_user LIKE ? 
    LIMIT ? OFFSET ?
  `;
  let params = [`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`, limit, offset];

  // Consulta para contar el total de usuarios
  let queryCount = `
    SELECT COUNT(*) AS total FROM users 
    WHERE 
      id LIKE ? OR 
      type_user LIKE ? OR 
      name_user LIKE ? OR 
      state_user LIKE ?
  `;
  let countParams = [`%${buscar}%`, `%${buscar}%`, `%${buscar}%`, `%${buscar}%`];

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

// Ruta para actualizar el usuario (modulo actualizar)
router.put("/users/:id", (req, res) => {
  const { type_user, cellphone, state_user, password } = req.body;
  const id = req.params.id;

  if (!type_user || !cellphone || !state_user || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query = `
    UPDATE users 
    SET 
      type_user = ?, 
      cellphone = ?, 
      state_user = ?, 
      password = ?
    WHERE id = ?
  `;

  conexion.query(query, [type_user, cellphone, state_user, password, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ error: 'Hubo un error al actualizar el usuario.' });
    }

    res.json({ message: 'Usuario actualizado exitosamente.' });
  });
});

module.exports = router;
