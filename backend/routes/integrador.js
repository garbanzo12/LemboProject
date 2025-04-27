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
    const sql = "SELECT name_consumables FROM consumables WHERE state_consumables = 'habilitado'";
    conexion.query(sql, (error, results) => {
        if (error) return res.status(500).json({ error: "Error en la base de datos" });
        if (!results.length) return res.status(404).json([]);
        res.json(results);
    });
});

router.post("/productions", async (req, res) => {
    const { name_production, responsable, users_selected, crops_selected, name_cropCycle, name_consumables, name_sensor } = req.body;

    if (!name_production || !responsable || !users_selected || !crops_selected || !name_cropCycle || !name_consumables || !name_sensor) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
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

        const sql = "INSERT INTO productions (name_production, responsable, users_selected, crops_selected, name_cropCycle, name_consumables, name_sensor, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        conexion.query(sql, [name_production, responsable, users_selected, crops_selected, name_cropCycle, name_consumables, name_sensor, id], (error, resultado) => {
            if (error) {
                return res.status(500).json({ 
                    error: "Error al guardar en base de datos",
                    details: error.code === 'ER_DUP_ENTRY' ? "El nombre de producción ya existe" : "Error del servidor"
                });
            }

            res.json({ success: true, message: "Producción creada exitosamente", id });
        });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar en base de datos", details: error.message });
    }
});

module.exports = router;
