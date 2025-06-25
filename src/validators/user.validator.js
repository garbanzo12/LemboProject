const { body } = require('express-validator');

exports.registerValidator = [
  body('id').notEmpty().withMessage('Identificación requerida'),
  body('name').notEmpty().isLength({ min: 2 }).withMessage('Nombre requerido'),
  body('charge').notEmpty().isLength({ min: 2 }).withMessage('Cargo requerido'),
  body('contact').notEmpty().withMessage('Contacto requerido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres')
];

exports.loginValidator = [
  body('id').notEmpty().withMessage('Identificación requerida'),
  body('password').notEmpty().withMessage('Contraseña requerida')
];
