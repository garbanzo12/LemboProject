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

    const { type_consumables,name_consumables, quantity_consumables, unit_consumables, unitary_value,total_value,description_consumables } = req.body;

    if (!type_consumables || !name_consumables || !quantity_consumables || !unit_consumables || !unitary_value || !total_value || !description_consumables) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO consumables (type_consumables,name_consumables, quantity_consumables, unit_consumables, unitary_value, total_value,description_consumables) VALUES (?, ?, ?, ?, ? ,? ,?)";
    conexion.query(sql, [type_consumables,name_consumables, quantity_consumables, unit_consumables, unitary_value,total_value,description_consumables], (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al insertar datos" });
        }
        res.json({ mensaje: "Datos guardados correctamente" });
    });
});



// Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
