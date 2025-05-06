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






// actualizar Integrador ⬇️
router.get("/productions/ids", async (req, res) => {
    try {
        const [result] = await conexion.promise().query("SELECT id FROM productions");
        res.json(result);
    } catch (err) {
        console.error("Error al obtener IDs:", err);
        res.status(500).json({ error: "Error al obtener IDs" });
    }
});
router.get("/productions/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await conexion.promise().query("SELECT * FROM productions WHERE id = ?", [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Producción no encontrada" });
        }

        const produccion = result[0];

        // Descomponer los campos que estaban como strings separados por comas
        produccion.users_selected = produccion.users_selected?.split(",").map(s => s.trim()) || [];
        produccion.crops_selected = produccion.crops_selected?.split(",").map(s => s.trim()) || [];
        produccion.name_cropCycle = produccion.name_cropCycle?.split(",").map(s => s.trim()) || [];
        produccion.name_consumables = produccion.name_consumables?.split(",").map(s => s.trim()) || [];
        produccion.quantity_consumables = produccion.quantity_consumables?.split(",").map(s => s.trim()) || [];
        produccion.unitary_value_consumables = produccion.unitary_value_consumables?.split(",").map(s => s.trim()) || [];
        produccion.total_value_consumables = parseFloat(produccion.total_value_consumables || 0);
        produccion.name_sensor = produccion.name_sensor?.split(",").map(s => s.trim()) || [];
        produccion.state_production = produccion.state_production?.split(",").map(s => s.trim()) || [];
        
        res.json(produccion);
    } catch (err) {
        console.error("Error al obtener producción:", err);
        res.status(500).json({ error: "Error al obtener la producción" });
    }
});
router.put("/productions/:id", async (req, res) => {
    const { id } = req.params;
    let {
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
        state_production
    } = req.body;

    try {
        // Validación mínima
        if (!name_production || !responsable) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        
        // Convertir arrays a strings
        users_selected = Array.isArray(users_selected) ? users_selected.join(", ") : users_selected;
        crops_selected = Array.isArray(crops_selected) ? crops_selected.join(", ") : crops_selected;
        name_cropCycle = Array.isArray(name_cropCycle) ? name_cropCycle.join(", ") : name_cropCycle;
        name_consumables = Array.isArray(name_consumables) ? name_consumables.join(", ") : name_consumables;
        quantity_consumables = Array.isArray(quantity_consumables) ? quantity_consumables.join(", ") : quantity_consumables;
        unitary_value_consumables = Array.isArray(unitary_value_consumables) ? unitary_value_consumables.join(", ") : unitary_value_consumables;
        total_value_consumables = Array.isArray(total_value_consumables) ? total_value_consumables.join(", ") : total_value_consumables;
        name_sensor = Array.isArray(name_sensor) ? name_sensor.join(", ") : name_sensor;
        state_production = Array.isArray(state_production) ? state_production.join(", ") : state_production;

        const sql = `
            UPDATE productions SET
                name_production = ?, responsable = ?, users_selected = ?, crops_selected = ?, 
                name_cropCycle = ?, name_consumables = ?, quantity_consumables = ?, 
                unitary_value_consumables = ?, total_value_consumables = ?, name_sensor = ?, state_production = ?
            WHERE id = ?
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
            state_production,
            id
        ]);

        res.json({ success: true, message: "Producción actualizada correctamente" });
    } catch (err) {
        console.error("Error al actualizar producción:", err);
        res.status(500).json({ error: "Error al actualizar producción" });
    }
});
// para ddevolver un insumo ya no requerido
router.post("/consumable/devolver-stock", async (req, res) => {
    const { name_consumables, cantidadDevuelta } = req.body;

    if (!name_consumables || !cantidadDevuelta) {
        return res.status(400).json({ error: "Faltan parámetros" });
    }

    try {
        await conexion.promise().query(
            "UPDATE consumables SET quantity_consumables = quantity_consumables + ? WHERE name_consumables = ?",
            [cantidadDevuelta, name_consumables]
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Error devolviendo stock:", error);
        res.status(500).json({ error: "Error al devolver stock" });
    }
});
//⬇️ Ruta para buscar ⬇️
  // Ruta para listar IDs de Produccion (Modulo Buscar)
  router.get("/buscar-id-integrador/id", (req, res) => {
    const sql = "SELECT id FROM productions";
    conexion.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Error al obtener IDs" });
      const ids = results.map(row => row.id);
      res.json({ producciones: ids });
    });
  });
  
  // Ruta para obtener cultivo por ID, para poder visualizar
  router.get("/api/conseguir-datos-id/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM productions WHERE id = ?";
  
    conexion.query(sql, [id], (error, resultado) => {
      if (error) return res.status(500).json({ error: "Error al obtener cultivo" });
      if (resultado.length === 0) return res.status(404).json({ mensaje: "Cultivo no encontrado" });
      res.json(resultado[0]);
    });
  });

//⬆️ Ruta para buscar ⬆️

 // Ruta para listar producciones con paginación y búsqueda
// Ruta para listar producciones con paginación y búsqueda
router.get("/listar-produccion", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const buscar = req.query.buscar || "";
    const limit = 10;
    const offset = (page - 1) * limit;

    // Manejo seguro de valores NULL
    const safeSearch = buscar === '' ? null : `%${buscar}%`;

    const queryData = `
    SELECT 
        id,
        COALESCE(name_production, '') as name_production,
        COALESCE(responsable, '') as responsable,
        COALESCE(users_selected, '[]') as users_selected,
        COALESCE(crops_selected, '[]') as crops_selected,
        COALESCE(name_cropCycle, '') as name_cropCycle,
        COALESCE(name_consumables, '[]') as name_consumables,
        COALESCE(quantity_consumables, '[]') as quantity_consumables,
        COALESCE(unitary_value_consumables, '[]') as unitary_value_consumables,
        COALESCE(total_value_consumables, 0) as total_value_consumables,
        COALESCE(name_sensor, '[]') as name_sensor,
        COALESCE(state_production, 'habilitado') as state_production
    FROM productions
    WHERE 
        (? IS NULL OR id LIKE ?) OR
        (? IS NULL OR name_production LIKE ?) OR
        (? IS NULL OR responsable LIKE ?) OR
        (? IS NULL OR name_cropCycle LIKE ?) OR
        (? IS NULL OR name_sensor LIKE ?) OR
        (? IS NULL OR name_consumables LIKE ?) OR
        (? IS NULL OR crops_selected LIKE ?) OR
        (? IS NULL OR users_selected LIKE ?)
    LIMIT ? OFFSET ?
`;

const queryCount = `
    SELECT COUNT(*) AS total 
    FROM productions
    WHERE 
        (? IS NULL OR id LIKE ?) OR
        (? IS NULL OR name_production LIKE ?) OR
        (? IS NULL OR responsable LIKE ?) OR
        (? IS NULL OR name_cropCycle LIKE ?) OR
        (? IS NULL OR name_sensor LIKE ?) OR
        (? IS NULL OR name_consumables LIKE ?) OR
        (? IS NULL OR crops_selected LIKE ?) OR
        (? IS NULL OR users_selected LIKE ?)
`;

// Parámetros actualizados para ambas consultas
const params = [
    safeSearch, safeSearch,       // id
    safeSearch, safeSearch,       // name_production
    safeSearch, safeSearch,       // responsable
    safeSearch, safeSearch,       // name_cropCycle
    safeSearch, safeSearch,       // name_sensor
    safeSearch, safeSearch,       // name_consumables
    safeSearch, safeSearch,       // crops_selected
    safeSearch, safeSearch,       // users_selected
    limit, offset
];

const countParams = [
    safeSearch, safeSearch,       // id
    safeSearch, safeSearch,       // name_production
    safeSearch, safeSearch,       // responsable
    safeSearch, safeSearch,       // name_cropCycle
    safeSearch, safeSearch,       // name_sensor
    safeSearch, safeSearch,       // name_consumables
    safeSearch, safeSearch,       // crops_selected
    safeSearch, safeSearch        // users_selected
];
    // Primera consulta: Obtener datos
    conexion.query(queryData, params, (err, results) => {
        if (err) {
            console.error("Error en consulta de datos:", err);
            return res.status(500).json({ 
                error: "Error al obtener producciones",
                details: err.message 
            });
        }

        // Segunda consulta: Obtener total
        conexion.query(queryCount, countParams, (err2, countResults) => {
            if (err2) {
                console.error("Error en consulta de conteo:", err2);
                return res.status(500).json({ 
                    error: "Error al contar producciones",
                    details: err2.message 
                });
            }

            try {
                // Procesar los resultados para manejar arrays JSON
                const producciones = results.map(row => {
                    // Debug: verificar el valor crudo
                    return {
                        ...row,
                        users_selected: safeParseJSON(row.users_selected),
                        crops_selected: safeParseJSON(row.crops_selected),
                        name_consumables: safeParseJSON(row.name_consumables),
                        quantity_consumables: (row.quantity_consumables),
                        unitary_value_consumables: safeParseJSON(row.unitary_value_consumables),
                        name_sensor: safeParseJSON(row.name_sensor)
                    };
                });

                res.json({ 
                    producciones: producciones,
                    total: countResults[0].total 
                });
            } catch (parseError) {
                console.error("Error parseando JSON:", parseError);
                res.status(500).json({ 
                    error: "Error procesando datos",
                    details: parseError.message 
                });
            }
        });
    });
});

// Función helper para parsear JSON de forma segura
function safeParseJSON(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        // Si falla el parseo, intentar separar por comas
        if (typeof jsonString === 'string') {
            return jsonString.split(',').map(item => item.trim());
        }
        return [];
    }
}






module.exports = router;




//⬇️ Visualizar datos de la produccion en general ⬇️


// Endpoint para obtener datos de cultivos
// Endpoint para obtener cultivos con su tamaño en m²
router.get("/api/cultivos", async (req, res) => {
    const sql = `
      SELECT name_crop, size_m2 
      FROM crops
      WHERE state_crop = 'habilitado'
    `;
  
    conexion.query(sql, (err, resultados) => {
      if (err) {
        console.error("Error al obtener cultivos:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }
  
      res.json(resultados);
    });
  });


  router.get("/api/estado-produccion", async (req, res) => {
    const sql = `
      SELECT state_production
      FROM productions
      
    `;
  
    conexion.query(sql, (err, resultados) => {
      if (err) {
        console.error("Error al obtener cultivos:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }
  
      res.json(resultados);
    });
  });


  router.get("/api/insumos", async (req, res) => {
    const sql = `
        SELECT name_consumables, quantity_consumables
        FROM consumables
        WHERE state_consumables = 'habilitado'
    `;

    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error al obtener insumos:", err);
            return res.status(500).json({ error: "Error en la base de datos" });
        }

        res.json(resultados);
    });
});

router.get("/api/finanzas", async (req, res) => {
    const sql = `
        SELECT 
            MONTH(created_at) AS mes,
            SUM(total_value) AS total_mensual
        FROM consumables
        WHERE state_consumables = 'habilitado'
        GROUP BY mes
        ORDER BY mes;
    `;

    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error al obtener datos financieros:", err);
            return res.status(500).json({ error: "Error en la base de datos" });
        }

        res.json(resultados); // [{mes: 1, total_mensual: 2000}, ...]
    });
});


router.get("/api/costos-cultivos", (req, res) => {
    const sql = `
    SELECT 
    MONTH(p.created_at) AS mes,
    p.crops_selected AS cultivo,
    SUM(p.total_value_consumables) AS costo_total
    FROM productions p
    WHERE p.state_production = 'habilitado'
    GROUP BY mes, cultivo
    ORDER BY mes;
    `;

    conexion.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error al obtener costos de cultivos:", err);
            return res.status(500).json({ error: "Error en la base de datos" });
        }

        res.json(resultados);
    });
});

// Ruta para obtener datos de inversión anual
router.get('/api/inversion-anual', (req, res) => {
    const sql = `
 SELECT 
    p.crops_selected AS nombre,
    SUM(p.total_value_consumables) AS total_inversion
FROM productions p
WHERE p.state_production = 'habilitado'
  AND YEAR(p.created_at) = YEAR(CURDATE())
GROUP BY p.crops_selected
ORDER BY p.crops_selected;
    `;
  
    conexion.query(sql, (err, results) => {
      if (err) {
        console.error('Error en consulta SQL:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.json(results);
    });
  });