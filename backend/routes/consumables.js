//La conexion con la bd
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configurar conexión a la BD
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "lembo_sgal_db"
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
