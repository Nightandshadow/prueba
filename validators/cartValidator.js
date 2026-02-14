/**
 * Validaciones para carrito.
 */

const { body, validationResult } = require('express-validator');

const addToCartRules = [
  body('product_id').isInt({ min: 1 }).withMessage('product_id debe ser un entero positivo'),
  body('cantidad').optional().isInt({ min: 1 }).withMessage('cantidad debe ser al menos 1'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  addToCartRules,
  validate,
};
