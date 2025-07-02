const { body } = require('express-validator');

// ✅ Validaciones para el registro
exports.registerValidator = [
  body('type_user')
    .notEmpty().withMessage('Tipo de usuario requerido')
    .isIn(['Administrador', 'Personal de Apoyo', 'Visitante']).withMessage('Tipo de usuario inválido'),

  body('type_ID')
    .notEmpty().withMessage('Tipo de documento requerido')
    .isIn([
      'Cedula de Ciudadanía',
      'Tarjeta de Identidad',
      'Cédula de extranjería',
      'PEP',
      'Permiso Por Protección Temporal'
    ]).withMessage('Tipo de documento inválido'),

  body('num_document_identity')
    .notEmpty().withMessage('Número de documento requerido')
    .isLength({ min: 6, max: 12 }).withMessage('Debe tener entre 6 y 12 caracteres'),

  body('name_user')
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

  body('email')
    .notEmpty().withMessage('Correo requerido')
    .isEmail().withMessage('Correo inválido'),

  body('cellphone')
    .notEmpty().withMessage('Celular requerido')
    .isMobilePhone('es-CO').withMessage('Número de celular inválido'),

  body('password')
    .notEmpty().withMessage('Contraseña requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres')
];

// ✅ Validaciones para el login
exports.loginValidator = [
  body('email')
    .notEmpty().withMessage('Email de usuario requerido'),
    

  body('password')
    .notEmpty().withMessage('Contraseña requerida')
];
