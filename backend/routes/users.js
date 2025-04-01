// Inyeccion sql a la table users

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
app.post("/users", (req, res) => {
    console.log("Datos recibidos en POST /users:", req.body); 

    const { type_user,type_ID, name_user, email, contact,password } = req.body;

    if (!type_user || !type_ID || !name_user || !email || !contact  || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO users (type_user,type_ID, name_user, email, contact,password) VALUES (?, ?, ?, ?, ?, ?)";
    conexion.query(sql, [type_user, type_ID, name_user, email, contact,password], (error, resultado) => {
        if (error) {
            console.error("Error SQL:", error.sqlMessage);
            return res.status(500).json({ error: error.sqlMessage });
        }
        res.json({ mensaje: "Datos guardados correctamente" });
  
    
    });
});



// Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
