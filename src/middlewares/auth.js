const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

module.exports = function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Aquí tienes _id, userId, name_user
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};
