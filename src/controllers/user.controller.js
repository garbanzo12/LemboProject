// Buscar usuario por nombre
exports.searchUser = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    if (nombre) {
      const usuario = await User.findOne({ name_user: { $regex: `^${nombre}$`, $options: 'i' } });
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      return res.status(200).json(usuario);
    }
    // Si no, devolver solo los nombres
    const usuarios = await User.find({}, { name_user: 1, _id: 0 });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar usuario", error });
  }
};
const User = require('../models/user.model');
const Counter = require('../models/counters/counter4.model '); // Asegúrate de tenerlo
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

// Registro
exports.register = async (req, res) => {
  try {
    // Incrementa el contador
        const counter = await Counter.findOneAndUpdate(
          { _id: 'userId' },               // el id del contador que manejamos
          { $inc: { seq: 1 } },            // incrementa en 1
          { new: true, upsert: true }      // crea si no existe
        );
        req.body.userId = counter.seq;
        const user = new User(req.body);
        await user.save();
        const readableId = user.userId.toString().padStart(3, '0');

    const token = jwt.sign(
      { _id: user._id, userId: user.userId, name: user.name_user },
      SECRET,
  { expiresIn: '2h' }
    );
    res.status(201).json({ message: 'Usuario registrado exitosamente',userId: readableId, data: user, token });


  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Error en registro',  error});
  }
};

// Login
// controllers/user.controller.js

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar por email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Crear token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name_user,
        role: user.type_user  // Esto es clave para el frontend
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login', error });
  }
};


// Ver perfil (requiere middleware de auth que coloque req.user)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};
exports.searchUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};



// Actualizar un usuario
exports.updateUser = async (req, res) => {
   try {
  
      // Traducir los nombres del frontend a los del modelo
      const body = {
        type_user: req.body.tipo_usuario,
        type_ID: req.body.tipo_documento,
        num_document_identity: req.body.numero_documento,
        name_user: req.body.nombre_usuario,
        email: req.body.correo,
        state_user: req.body.estado_usuario,
        update_at: new Date()
      };
      

      const user = await User.findByIdAndUpdate(req.params.id, body, { new: true });
    console.log("👀 Usuario encontrado:", user);

      if (!user) return res.status(404).json({ message: 'usuario no encontrado' });
  
      res.status(200).json({ message: 'usuario actualizado', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
};


// 🔄 Ruta GET con paginación y búsqueda
exports.listUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || '';
  const limit = 10;
  const skip = (page - 1) * limit;
  const regex = new RegExp(buscar, 'i'); // 🔍 Búsqueda insensible a mayúsculas/minúsculas

      let filtro = {
  $or: [
    { type_user: regex },
    { type_ID: regex },
    { num_document_identity: regex },
    { name_user: regex },
    { email: regex },
    { cellphone: regex }
  ]
};

  try {
    const [usuarios, total] = await Promise.all([
      User.find(filtro).skip(skip).limit(limit),
      User.countDocuments(filtro)
    ]);

    res.json({ usuarios, total });
  } catch (error) {
    console.error('❌ Error al listar usuarios:', error);
    res.status(500).json({ message: 'Error al listar usuarios', error });
  }
};
exports.getuserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};


// Usuarios habilitados (solo nombre)
exports.searchEnabledUsers = async (req, res) => {
  try {
    const users = await User.find(
      { state_user: "habilitado" }, // filtro
      { name_user: 1, _id: 0 }      // proyección
    );

    if (!users.length) return res.status(404).json([]);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios habilitados", error });
  }
};





exports.getusers = async (req, res) => {
  try {
    const users = await User.find({}, { name_user: 1, _id: 0 });
    
    if (!users.length) return res.status(200).json([]); // mejor 200 que 404
    res.status(200).json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener users habilitados", error });
  }
};
