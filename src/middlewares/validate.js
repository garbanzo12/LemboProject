const { validationResult } = require('express-validator');

module.exports = function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};
