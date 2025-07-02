const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: {                      // Equivalente al id autoincremental
    type: Number,
    unique: true
  },
  type_user: {
    type: String,
    enum: ['Administrador', 'Personal de Apoyo', 'Visitante'],
    required: true
  },
  type_ID: {
    type: String,
    enum: [
      'Cedula de Ciudadanía',
      'Tarjeta de Identidad',
      'Cédula de extranjería',
      'PEP',
      'Permiso Por Protección Temporal'
    ],
    required: true
  },
  num_document_identity: {
    type: String,
    required: true,
    unique: true,
    maxlength: 12,
    trim: true
  },
  name_user: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  cellphone: {
    type: String,
    maxlength: 20,
    trim: true
  },
  state_user: {
    type: String,
    enum: ['habilitado', 'deshabilitado'],
    default: 'habilitado'
  },
  state_sensor: {
    type: String,
    enum: ['habilitado', 'deshabilitado'],
    default: 'habilitado'
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
