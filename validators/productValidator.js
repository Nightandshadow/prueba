/**
 * Validaciones para productos (álbumes). express-validator.
 */

const { body, validationResult } = require('express-validator');

const createProductRules = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('codigo').trim().notEmpty().withMessage('El código es obligatorio'),
  body('precio')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser mayor a 0'),
  body('descripcion').optional().trim(),
  body('artista').optional().trim(),
  body('imagen').optional().trim(),
  body('genero').optional().trim(),
  body('anio').optional({ values: 'falsy' }).isInt({ min: 1900, max: 2100 }).withMessage('Año inválido'),
  body('num_canciones').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Número de canciones debe ser positivo'),
  body('info_relevante').optional().trim(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  createProductRules,
  validate,
};
