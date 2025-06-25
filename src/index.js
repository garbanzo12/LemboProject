require('dotenv').config(); // <- Carga variables de entorno desde un archivo .env, como PORT y MONGO_URI. Evita poner datos sensibles directamente en el código.
const express = require('express'); // <- Importa el módulo express, el framework que usamos para crear nuestro servidor web y definir rutas HTTP.
const cors = require('cors'); // <- Importa el middleware cors que permite solicitudes entre diferentes dominios. Muy útil cuando el frontend y backend no están en el mismo servidor.
const morgan = require('morgan');
const connectDB = require('./config/db');
// Importa el middleware cors que permite solicitudes entre diferentes dominios. Muy útil cuando el frontend y backend no están en el mismo servidor.
// const errorHandler = require('./middlewares/errorHandler');
// const userRoutes = require('./routes/user.routes');
// const authRoutes = require('./routes/auth.routes');
// const collaboratorRoutes = require('./routes/collaborator.routes');
// const siembraRoutes = require('./routes/siembra.routes');
// const toolRoutes = require('./routes/tool.routes');


const cropRoutes = require('./routes/crop.routes');


const app = express(); // <- Crea la instancia principal de Express, que se usa para configurar middlewares, rutas, etc.
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // <- para ver las peticiones en consola, pro ejemplo GET /api/users 200 15.234 ms - 324 , POST /api/auth/login 401 8.432 ms - 45
// app.use('/api/tools', toolRoutes);
// app.use('/api/collaborators', collaboratorRoutes);
// app.use('/api/siembras', siembraRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
// app.use(errorHandler);



connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
