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

    const { ciclo__user,ciclo__document, ciclo__nameUser, ciclo__email, ciclo__cellPhone } = req.body;

    if (!ciclo__user || !ciclo__document || !ciclo__nameUser || !ciclo__email || !ciclo__cellPhone) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let sql = "INSERT INTO crops (ciclo__user,ciclo__document, ciclo__nameUser, ciclo__email, ciclo__cellPhone) VALUES (?, ?, ?, ?, ?)";
    conexion.query(sql, [ciclo__user,ciclo__document, ciclo__nameUser, ciclo__email, ciclo__cellPhone], (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al insertar datos" });
        }
        res.json({ mensaje: "Datos guardados correctamente" });
    });
});



// Iniciar servidor
app.listen(5501, () => console.log("Servidor corriendo en puerto 5501"));
