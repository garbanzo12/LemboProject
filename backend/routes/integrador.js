
function integrador(){

    require("dotenv").config();
    const express = require("express");
    const cors = require("cors");
    const mysql = require("mysql2");
    const app = express(); // 👈 Le asignamos a app las propiedades express, para poder crear rutas
    app.use(express.json()); // ← Faltaba esto para parsear el body JSON
    
    
    // Middleware para CORS (debe ir antes de las rutas)
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    
    // Middleware para analizar formularios codificados (application/x-www-form-urlencoded)
    app.use(express.urlencoded({ extended: true }));
    
    
    //⬇️ Configuramos conexión a la BD
    const conexion = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
    
    conexion.connect((err) => {
        if (err) throw err;
        console.log('Conectado a MySQL');
    });
    
    
    app.get("/users/responsable", (req, res) => {
        const sql = "SELECT name_user FROM users WHERE state_user = 'habilitado'";
        conexion.query(sql, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json([]); // Devuelve un array vacío si no hay resultados
            }
            
            res.json(results); // Devuelve el array de usuarios
        });
    });
    
    app.get("/users/responsable", (req, res) => {
        const sql = "SELECT name_user FROM users WHERE state_user = 'habilitado'";
        conexion.query(sql, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json([]); // Devuelve un array vacío si no hay resultados
            }
            
            res.json(results); // Devuelve el array de usuarios
        });
    });
    
    
    app.get("/crops/responsable", (req, res) => {
        const sql = "SELECT name_crop FROM crops WHERE state_crop = 'habilitado'";
        conexion.query(sql, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json([]); // Devuelve un array vacío si no hay resultados
            }
            
            res.json(results); // Devuelve el array de cultivos
        });
    });
    
    app.get("/cycle/responsable", (req, res) => {
        const sql = "SELECT name_cropCycle FROM cropcycle WHERE state_cycle = 'habilitado'";
        conexion.query(sql, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json([]); // Devuelve un array vacío si no hay resultados
            }
            
            res.json(results); // Devuelve el array de cultivos
        });
    });
    
    
    app.get("/sensors/responsable", (req, res) => {
        const sql = "SELECT name_sensor FROM sensors WHERE state_sensor = 'habilitado'";
        conexion.query(sql, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json([]); // Devuelve un array vacío si no hay resultados
            }
            
            res.json(results); // Devuelve el array de insumos
        });
    });
    
    app.get("/consumable/responsable", (req, res) => {
        const sql = "SELECT name_consumables FROM consumables WHERE state_consumables = 'habilitado'";
        conexion.query(sql, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json([]); // Devuelve un array vacío si no hay resultados
            }
            
            res.json(results); // Devuelve el array de sensor
        });
    });
    // Ruta POST simplificada
    app.post("/productions", async (req, res) => {
        const { name_production,responsable,users_selected,crops_selected,name_cropCycle,name_consumables,name_sensor } = req.body;
    
        if (!name_production || !responsable  || !users_selected || !crops_selected|| !name_cropCycle|| !name_consumables || !name_sensor) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
    
        // Generar ID simple (puedes personalizar esto)
        try {
            // Paso 1: Obtener el último ID de la base de datos
            const [lastIdResult] = await conexion.promise().query(
                "SELECT id FROM productions ORDER BY created_at DESC LIMIT 1"
            );
    
            // Paso 2: Generar el nuevo ID
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const datePart = `${day}${month}${year}`; // Formato DDMMYYYY
    
            let sequenceNumber = 1; // Valor por defecto si no hay registros
    
            if (lastIdResult.length > 0) {
                const lastId = lastIdResult[0].id;
                // Extraer solo la parte numérica del final del ID
                const lastSequence = parseInt(lastId.split('-').pop()) || 0;
                sequenceNumber = lastSequence + 1;
            }
    
            // Generar ID con formato: PROD-Nombre-Fecha-Secuencial
            const id = `PROD-${name_production}-${datePart}-${String(sequenceNumber).padStart(3, '0')}`;
               // Insertar solo el nombre (otros campos tendrán valores por defecto)
        const sql = "INSERT INTO productions (name_production,responsable,users_selected,crops_selected,name_cropCycle,name_consumables,name_sensor, id) VALUES (?, ? , ?, ?, ?, ?, ?, ?)";
        conexion.query(sql, [name_production,responsable,users_selected,crops_selected,name_cropCycle,name_consumables,name_sensor, id], (error, resultado) => {
            if (error) {
                console.error("Error en DB:", error);
                return res.status(500).json({ 
                    error: "Error al guardar en base de datos",
                    details: error.code === 'ER_DUP_ENTRY' 
                        ? "El nombre de producción ya existe" 
                        : "Error del servidor"
                });
            }
            
            res.json({ 
                success: true,
                message: "Producción creada exitosamente", 
                id: id
            });
        });
    
        } catch (error) {
            console.error("Error en DB:", error);
            res.status(500).json({ 
                error: "Error al guardar en base de datos",
                details: error.message
            });
        }
    
    });
    
    
    const PORT = 5501;
    app.listen(PORT, () => {
        console.log(`Servidor listo en http://localhost:${PORT}`);
    });
    
}

integrador()