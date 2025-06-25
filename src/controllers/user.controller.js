const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

// Registro
exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { id: user._id, id: user.id, name: user.name },
      SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Usuario registrado', token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error en registro', error });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, id: user.id, name: user.name },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login', error });
  }
};

// Ver perfil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};
