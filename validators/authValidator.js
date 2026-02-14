/**
 * Validaciones para registro y login (express-validator).
 */

const { body, validationResult } = require('express-validator');

const registerRules = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['admin', 'usuario']).withMessage('Rol debe ser admin o usuario'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerRules,
  loginRules,
  validate,
};
