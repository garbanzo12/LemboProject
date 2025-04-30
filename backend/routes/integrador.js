const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

require("dotenv").config();

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
router.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL [integrador]');
});

// Todas tus rutas usando `router.get`, `router.post`, etc.
router.get("/users/responsable", (req, res) => {
    const sql = "SELECT name_user FROM users WHERE state_user = 'habilitado'";
    conexion.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: "Error en la base de datos" });
        if (!results.length) return res.status(404).json([]);
        res.json(results);
    });
});

router.get("/crops/responsable", (req, res) => {
    const sql = "SELECT name_crop FROM crops WHERE state_crop = 'habilitado'";
    conexion.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: "Error en la base de datos" });
        if (!results.length) return res.status(404).json([]);
        res.json(results);
    });
});

router.get("/cycle/responsable", (req, res) => {
    const sql = "SELECT name_cropCycle FROM cropcycle WHERE state_cycle = 'habilitado'";
    conexion.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: "Error en la base de datos" });
        if (!results.length) return res.status(404).json([]);
        res.json(results);
    });
});

router.get("/sensors/responsable", (req, res) => {
    const sql = "SELECT name_sensor FROM sensors WHERE state_sensor = 'habilitado'";
    conexion.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: "Error en la base de datos" });
        if (!results.length) return res.status(404).json([]);
        res.json(results);
    });
});

router.get("/consumable/responsable", (req, res) => {
    const sql = "SELECT name_consumables, quantity_consumables, unitary_value FROM consumables WHERE state_consumables = 'habilitado' AND quantity_consumables > 0";

    conexion.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: "Error en la base de datos" });
        if (!results.length) return res.status(404).json([]);
        res.json(results);
    });
});
router.post("/consumable/actualizar-stock", async (req, res) => {
    const { consumos } = req.body; // consumos será un array de objetos { name_consumables, cantidadConsumida }

    if (!Array.isArray(consumos) || consumos.length === 0) {
        return res.status(400).json({ error: "No se recibieron consumos válidos" });
    }

    const conexionPromesa = conexion.promise(); // Usamos conexion promesa para await

    try {
        for (const consumo of consumos) {
            const { name_consumables, cantidadConsumida } = consumo;

            // Actualizar stock en la base de datos
            await conexionPromesa.query(
                "UPDATE consumables SET quantity_consumables = quantity_consumables - ? WHERE name_consumables = ?",
                [cantidadConsumida, name_consumables]
            );
        }

        res.json({ mensaje: "Stock actualizado exitosamente" });
    } catch (error) {
        console.error("Error actualizando stock:", error);
        res.status(500).json({ error: "Error al actualizar stock" });
    }
});
router.post("/productions", async (req, res) => {
    let { name_production, responsable, users_selected, crops_selected, name_cropCycle, name_consumables, quantity_consumables,unitary_value_consumables,total_value_consumables, name_sensor } = req.body;

    // Validar que existan todos los campos
    if (!name_production || !responsable || !users_selected || !crops_selected || !name_cropCycle || !name_consumables || !quantity_consumables ||  !unitary_value_consumables|| !total_value_consumables ||!name_sensor) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    try {
        // ✅ Validar duplicado
        const [duplicateCheck] = await conexion.promise().query(
            "SELECT id FROM productions WHERE name_production = ?",
            [name_production]
        );
        if (duplicateCheck.length > 0) {
            return res.status(409).json({ error: "Ya existe una producción con ese nombre" }); // 409 Conflict
        }
        // Convertir arrays en strings separados por coma
        users_selected = Array.isArray(users_selected) ? users_selected.join(", ") : users_selected;
        crops_selected = Array.isArray(crops_selected) ? crops_selected.join(", ") : crops_selected;
        name_cropCycle = Array.isArray(name_cropCycle) ? name_cropCycle.join(", ") : name_cropCycle;
        name_consumables = Array.isArray(name_consumables) ? name_consumables.join(", ") : name_consumables;
        quantity_consumables = Array.isArray(quantity_consumables) ? quantity_consumables.join(", ") : quantity_consumables;  // Recordar que se tuvo que cambiar quantity_consumables a text para hacepat mas de un dato, pero a la hora de hacer operable estos valores se debe usar split(',') 
        unitary_value_consumables = Array.isArray(unitary_value_consumables) ? unitary_value_consumables.join(", ") : unitary_value_consumables; 
        total_value_consumables = Array.isArray(total_value_consumables) ? total_value_consumables.join(", ") : total_value_consumables; 
        name_sensor = Array.isArray(name_sensor) ? name_sensor.join(", ") : name_sensor;

        // Crear el ID personalizado
        const [lastIdResult] = await conexion.promise().query(
            "SELECT id FROM productions ORDER BY created_at DESC LIMIT 1"
        );

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const datePart = `${day}${month}${year}`;

        let sequenceNumber = 1;
        if (lastIdResult.length > 0) {
            const lastId = lastIdResult[0].id;
            const lastSequence = parseInt(lastId.split('-').pop()) || 0;
            sequenceNumber = lastSequence + 1;
        }

        const id = `PROD-${name_production}-${datePart}-${String(sequenceNumber).padStart(3, '0')}`;

        // Insertar en la base de datos
        const sql = `
            INSERT INTO productions 
            (name_production, responsable, users_selected, crops_selected, name_cropCycle, name_consumables, quantity_consumables,unitary_value_consumables,total_value_consumables, name_sensor, id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await conexion.promise().query(sql, [
            name_production,
            responsable,
            users_selected,
            crops_selected,
            name_cropCycle,
            name_consumables,
            quantity_consumables,
            unitary_value_consumables,
            total_value_consumables,
            name_sensor,
            id
        ]);

        res.json({ success: true, message: "Producción creada exitosamente", id });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error al guardar en base de datos", details: error.message });
    }
});


module.exports = router;
