require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express(); // 👈 Le asignamos a app las propiedades express, para poder crear rutas


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



// // // Ruta para obtener los usuarios (solo nombres)
// // app.get('/users', async (req, res) => {
// //     try {
// //       const [rows] = await pool.query('SELECT name_user FROM users WHERE state_user = "habilitado"');
// //       const users = rows.map(row => row.name_user);
// //       res.json(users);
// //     } catch (error) {
// //       console.error('Error al obtener usuarios:', error);
// //       res.status(500).json({ error: 'Error al obtener usuarios' });
// //     }
// //   });
  

  
// //   // Ruta para crear una nueva producción
// //   app.post('/productions', async (req, res) => {
// //     const { name_production, } = req.body;
    
// //     if (!name_production) {
// //       return res.status(400).json({ error: 'Faltan campos obligatorios' });
// //     }
// //   // 1. Obtener la fecha actual
// // const fecha = new Date();
// // const dia = String(fecha.getDate()).padStart(2, '0');
// // const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque enero = 0
// // const anio = fecha.getFullYear();
// // const fechaActual = `${dia}${mes}${anio}`;

// // // 2. Consultar cuántos IDs hay para esa fecha
// // const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM items WHERE id LIKE ?", [`${fechaActual}-%`]);
// // const cantidad = rows[0].total + 1;

// // // 3. Formatear número con ceros
// // const numero = String(cantidad).padStart(4, '0');
// // // 4. Generar ID final
// // const idFinal = `PROD-${fechaActual}-${numero}`;

// // // 5. Insertar en la tabla

// //     // Generar un ID único (puedes ajustar esto según tus necesidades)
  
// //     try {
// //       const [result] = await pool.query(
// //         'INSERT INTO productions (name_production,id) VALUES (?, ?)',
// //         [name_production, idFinal]
// //       );
      
// //       res.status(201).json({ 
// //         message: 'Producción creada exitosamente',
// //         id: idFinal
// //       });
// //     } catch (error) {
// //       if (error.code === 'ER_DUP_ENTRY') {
// //         return res.status(400).json({ error: 'El nombre de la producción ya existe' });
// //       }
// //       console.error('Error al crear producción:', error);
// //       res.status(500).json({ error: 'Error al crear producción' });
// //     }
// //   });
  
  

// app.post("/productions", (req, res) => {
//     console.log("Datos recibidos en POST /productions:", req.body); 

//     const { name_production } = req.body;

//     if (!name_production) {
//         return res.status(400).json({ error: "Todos los campos son obligatorios" });
//     }

//     const fecha = new Date();
//     const dia = String(fecha.getDate()).padStart(2, '0');
//     const mes = String(fecha.getMonth() + 1).padStart(2, '0');
//     const anio = fecha.getFullYear();
//     const fechaActual = `${dia}${mes}${anio}`;
    
//     // Generar un número aleatorio si no tienes un contador
//     const numeroAleatorio = Math.floor(Math.random() * 10000);
//     const numero = String(numeroAleatorio).padStart(4, '0');
    
//     const idFinal = `PROD-${fechaActual}-${numero}`;

//     let sql = "INSERT INTO productions (name_production, id) VALUES (?, ?)"; // Corregido el paréntesis
//     conexion.query(sql, [name_production, idFinal], (error, resultado) => {
//         if (error) {
//             console.error("Error al insertar datos:", error);
//             // Asegúrate de enviar una respuesta JSON válida incluso en errores
//             return res.status(500).json({ 
//                 error: "Error al insertar datos",
//                 details: error.message 
//             });
//         }

//         console.log("Resultado del INSERT:", resultado);
//         // Asegúrate de que siempre devuelvas un JSON válido
//         res.json({ 
//             mensaje: "Datos guardados correctamente", 
//             id: idFinal // Usamos idFinal ya que es el ID que generamos
//         });
//     });
// });
//   // Iniciar el servidor
//   const PORT = process.env.PORT || 5501;
//   app.listen(PORT, () => {
//     console.log(`Servidor corriendo en el puerto ${PORT}`);
//   });
//   app.get('/test', (req, res) => {
//     res.json({ message: "Test exitoso" });
//   });



// Ruta POST simplificada
app.post("/productions", (req, res) => {
    const { name_production } = req.body;

 

    // Generar ID simple (puedes personalizar esto)
    const id = 'PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Insertar solo el nombre (otros campos tendrán valores por defecto)
    const sql = "INSERT INTO productions (name_production, id) VALUES (?, ?)";
    conexion.query(sql, [name_production, id], (error, resultado) => {
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
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ status: "active", message: "Servidor funcionando" });
});

const PORT = 5501;
app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});
