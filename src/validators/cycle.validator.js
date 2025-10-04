const { body } = require('express-validator');

exports.cycleValidator = [
  body('name_cycle')
    .notEmpty().withMessage('El nombre del ciclo es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

  body('cycle_start')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)'),

  body('cycle_end')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida (YYYY-MM-DD)'),

  body('description_cycle')
    .notEmpty().withMessage('La descripción del ciclo es obligatoria')
    .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres'),

  body('news_cycle')
    .notEmpty().withMessage('La novedad es obligatoria')
    .isLength({ min: 2 }).withMessage('La novedad debe tener al menos 2 caracteres')
];
