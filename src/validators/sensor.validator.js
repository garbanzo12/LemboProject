const { body } = require('express-validator');

exports.sensorValidator = [
  body('type_sensor').isLength({ min: 2 }).notEmpty().withMessage('Tipo requerido'),
  body('name_sensor').notEmpty().isLength({ min: 2 }).withMessage('Nombre requerido'),
  body('unit_sensor').notEmpty().isInt().withMessage('Unidad de medidada requerida'),
  body('time_sensor').notEmpty().isInt().withMessage('Tiempo requerido'),
  body('unit_time_sensor').notEmpty().isInt().withMessage('Unidad de medida de lectura requerido'),
  body('description_sensor').notEmpty().withMessage('Descripción requerida')
];

