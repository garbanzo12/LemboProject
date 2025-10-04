const { body } = require('express-validator');

exports.consumableValidator = [
  body('type_consumables').notEmpty().isLength({ min: 2 }).withMessage('Tipo requerido'),
  body('name_consumables').notEmpty().isLength({ min: 2, max: 100 }).withMessage('Nombre requerido'),
  body('quantity_consumables').notEmpty().isInt({ min: 1 }).withMessage('Cantidad inválida'),
  body('unit_consumables').notEmpty().isLength({ max: 20 }).withMessage('Unidad requerida'),
  body('unitary_value').notEmpty().isNumeric().withMessage('Valor unitario inválido'),
  body('total_value').notEmpty().isNumeric().withMessage('Valor total inválido'),
  body('description_consumables').optional().isString().withMessage('Descripción inválida'),
  body('state_consumables').optional().isIn(['habilitado', 'deshabilitado']).withMessage('Estado inválido')
];
