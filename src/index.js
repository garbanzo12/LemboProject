require('dotenv').config(); // <- Carga variables de entorno desde un archivo .env, como PORT y MONGO_URI. Evita poner datos sensibles directamente en el código.
const express = require('express'); // <- Importa el módulo express, el framework que usamos para crear nuestro servidor web y definir rutas HTTP.
const cors = require('cors'); // <- Importa el middleware cors que permite solicitudes entre diferentes dominios. Muy útil cuando el frontend y backend no están en el mismo servidor.
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const cropRoutes = require('./routes/crop.routes');
const cycleRoutes = require('./routes/cycle.routes');
const sensorRoutes = require('./routes/sensor.routes');

const app = express(); // <- Crea la instancia principal de Express, que se usa para configurar middlewares, rutas, etc.
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // <- para ver las peticiones en consola, pro ejemplo GET /api/users 200 15.234 ms - 324 , POST /api/auth/login 401 8.432 ms - 45
app.use('/api/auth', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/cycle', cycleRoutes);
app.use('/api/sensor', sensorRoutes);
// app.use(errorHandler);



connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
