const { body } = require('express-validator');

exports.cropValidator = [
  body('name_crop').isLength({ min: 2 }).notEmpty().withMessage('Nombre requerido'),
  body('type_crop').notEmpty().isLength({ min: 2 }).withMessage('Tipo requerido'),
  body('location').notEmpty().isLength({ min: 2 }).withMessage('Ubicación requerida'),
  body('description_crop').notEmpty().withMessage('Descripción requerida'),
  body('size_m2').notEmpty().withMessage('Contraseña mínimo 6 caracteres')
];

